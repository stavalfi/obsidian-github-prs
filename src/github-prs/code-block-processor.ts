import humanizeDuration from "humanize-duration";
import { MarkdownPostProcessorContext } from "obsidian";
import * as Octokit from "octokit";
import { Column, Properties } from "../constants";
import { GithubPrsOptions } from "../types";
import { GetPropertyValue } from "./parser";

export function githubPrsCodeBlockProcessor(
	octokit: Octokit.Octokit,
): (
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext,
) => void | Promise<unknown> {
	return async (source, el, ctx) => {
		const errors: string[] = [];
		const author = GetPropertyValue({
			source,
			errors,
			property: Properties.AUTHOR,
		});
		const org = GetPropertyValue({
			source,
			errors,
			property: Properties.ORG,
		});
		const repo = GetPropertyValue({
			source,
			errors,
			property: Properties.REPO,
		});
		const columns = GetPropertyValue({
			source,
			errors,
			property: Properties.COLUMNS,
		});
		const state = GetPropertyValue({
			source,
			errors,
			property: Properties.STATE,
		});
		if (!author || !org || !repo || !columns || !state || errors.length > 0) {
			const tbody = el.createEl("table").createEl("tbody");
			tbody.createEl("tr").createEl("td", { text: "Errors" });
			for (const error of errors) {
				tbody.createEl("tr").createEl("td", { text: `* ${error}` });
			}
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
							row.createEl("td", { text: pr.title });
							break;
						}
						case Column.BRANCH: {
							row
								.createEl("td")
								.createEl("a", { href: pr.html_url }, (a) => {
									a.innerText = pr.head.ref;
								})
								.setCssStyles({ textAlign: "center", verticalAlign: "middle" });
							break;
						}
						case Column.CREATED: {
							const createdBeforeMs =
								Date.now() - new Date(pr.created_at).getTime();

							row
								.createEl("td", {
									text: `${humanizeDuration(createdBeforeMs, {
										units:
											createdBeforeMs < 1000 * 60 * 60 * 24
												? ["h", "m"]
												: ["mo", "d"],
										maxDecimalPoints: 0,
									})} ago`,
								})
								.setCssStyles({ textAlign: "center", verticalAlign: "middle" });
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
								})
								.setCssStyles({ textAlign: "center", verticalAlign: "middle" });
							break;
						}
						case Column.REPOSITORY: {
							row
								.createEl("td")
								.createEl("a", { href: pr.base.repo.html_url }, (a) => {
									a.innerText = pr.base.repo.name;
								})
								.setCssStyles({ textAlign: "center", verticalAlign: "middle" });
							break;
						}
						case Column.STATUS: {
							row
								.createEl("td", { text: pr.state })
								.setCssStyles({ textAlign: "center", verticalAlign: "middle" });
							break;
						}
					}
				}
			}),
		);
	};
}
