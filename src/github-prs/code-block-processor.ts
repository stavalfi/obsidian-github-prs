import humanizeDuration from "humanize-duration";
import { MarkdownPostProcessorContext } from "obsidian";
import * as Octokit from "octokit";
import { Column, Properties } from "../constants";
import { GithubPrsOptions } from "../types";
import { GetPropertyValue } from "./parser";

export function githubPrsCodeBlockProcessor(
	validOrgs: string[],
	validRepos: string[],
	octokit: Octokit.Octokit,
): (
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext,
) => void | Promise<unknown> {
	return async (source, el, ctx) => {
		console.log("stav2");
		const errors: string[] = [];
		const author = GetPropertyValue({
			source,
			errors,
			property: Properties.AUTHOR,
			validOrgs,
			validRepos,
		});
		const org = GetPropertyValue({
			source,
			errors,
			property: Properties.ORG,
			validOrgs,
			validRepos,
		});
		const repo = GetPropertyValue({
			source,
			errors,
			property: Properties.REPO,
			validOrgs,
			validRepos,
		});
		const columns = GetPropertyValue({
			source,
			errors,
			property: Properties.COLUMNS,
			validOrgs,
			validRepos,
		});
		const state = GetPropertyValue({
			source,
			errors,
			property: Properties.STATE,
			validOrgs,
			validRepos,
		});
		if (!author || !org || !repo || !columns || !state || errors.length > 0) {
			const tbody = el.createEl("table").createEl("tbody");
			tbody.createEl("tr").createEl("td", { text: "Errors" });
			for (const error of errors) {
				tbody.createEl("tr").createEl("td", { text: `* ${error}` });
			}
			console.log("stav-errors:", errors);
			return;
		}
		const githubPrsOptions: GithubPrsOptions = {
			author,
			columns,
			org,
			repo,
			state,
		};

		const prs = await octokit.rest.pulls
			.list({
				owner: githubPrsOptions.org,
				repo: githubPrsOptions.repo,
				state: githubPrsOptions.state,
				head: githubPrsOptions.author,
			})
			.then((r) =>
				r.data.filter((pr) => pr.user?.login === githubPrsOptions.author),
			);

		const table = el.createEl("table");
		const body = table.createEl("tbody");

		const header = body.createEl("tr");
		for (const column of githubPrsOptions.columns) {
			header.createEl("th", { text: column });
		}

		await Promise.all(
			prs.map(async (pr) => {
				const row = body.createEl("tr");
				for (const column of githubPrsOptions.columns) {
					switch (column) {
						case Column.TITLE: {
							row.createEl("td").createEl("a", { href: pr.html_url }, (a) => {
								a.innerText = pr.title;
							});
							break;
						}
						case Column.BRANCH: {
							row.createEl("td").createEl("a", { href: pr.html_url }, (a) => {
								a.innerText = pr.head.ref;
							});
							break;
						}
						case Column.CREATED: {
							row.createEl("td").createEl("a", { href: pr.html_url }, (a) => {
								a.innerText = pr.head.ref;
							});
							break;
						}
						case Column.LAST_COMMIT: {
							const { data: commit } = await octokit.rest.repos.getCommit({
								owner: "papayagaming",
								repo: "papaya-mono",
								ref: pr.head.sha,
							});
							const lastCommitBeforeMs =
								Date.now() -
								new Date(commit.commit.author?.date ?? 0).getTime();

							row
								.createEl("td")
								.createEl("a", { href: commit.html_url }, (a) => {
									a.innerText = `${humanizeDuration(lastCommitBeforeMs, {
										units:
											lastCommitBeforeMs < 1000 * 60 * 60 * 24
												? ["h", "m"]
												: ["mo", "d"],
										maxDecimalPoints: 0,
									})} ago`;
								});
							break;
						}
						case Column.REPOSITORY: {
							row
								.createEl("td")
								.createEl("a", { href: pr.base.repo.html_url }, (a) => {
									a.innerText = pr.base.repo.name;
								});
							break;
						}
						case Column.STATUS: {
							row.createEl("td", { text: pr.state });
							break;
						}
					}
					header.createEl("th", { text: column });
				}
			}),
		);
	};
}
