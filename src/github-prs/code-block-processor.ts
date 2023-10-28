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
		const authors = GetPropertyValue({
			source,
			errors,
			property: Properties.AUTHORs,
		});
		const org = GetPropertyValue({
			source,
			errors,
			property: Properties.ORG,
		});
		const repos = GetPropertyValue({
			source,
			errors,
			property: Properties.REPOS,
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
		if (!authors || !org || !repos || !columns || !state || errors.length > 0) {
			const tbody = el.createEl("table").createEl("tbody");
			tbody.createEl("tr").createEl("td", { text: "Errors" });
			for (const error of errors) {
				tbody.createEl("tr").createEl("td", { text: `* ${error}` });
			}
			return;
		}
		const githubPrsOptions: GithubPrsOptions = {
			authors,
			columns,
			org,
			repos,
			state,
		};

		const ghRequests = githubPrsOptions.authors.flatMap((author) =>
			githubPrsOptions.repos.map((repo) => ({
				owner: githubPrsOptions.org,
				repo: repo,
				state: githubPrsOptions.state,
				author,
			})),
		);

		const prs = await Promise.all(
			ghRequests.map((body) =>
				octokit.rest.pulls
					.list({
						owner: body.owner,
						repo: body.repo,
						state: body.state,
						head: body.author,
					})
					.then((r) =>
						Promise.all(
							r.data
								.filter((pr) => pr.user?.login === body.author)
								.map(async (pr) => {
									const createdBeforeMs =
										Date.now() - new Date(pr.created_at).getTime();
									const { data: lastCommit } =
										await octokit.rest.repos.getCommit({
											owner: pr.base.repo.owner.login,
											repo: pr.base.repo.name,
											ref: pr.head.sha,
										});
									const lastCommitBeforeMs =
										Date.now() -
										new Date(lastCommit.commit.author?.date ?? 0).getTime();
									return {
										pr,
										extraInfo: {
											...body,
											createdBeforeMs,
											lastCommit,
											lastCommitBeforeMs,
										},
									};
								}),
						),
					),
			),
		).then((r) => r.flat());

		prs.sort((a, b) => {
			const user =
				!a.pr.user?.login || !b.pr.user?.login
					? 0
					: a.pr.user.login.localeCompare(b.pr.user.login);
			if (user === 0) {
				const state = a.pr.state.localeCompare(b.pr.state);
				if (state === 0) {
					const repo = a.pr.base.repo.name.localeCompare(b.pr.base.repo.name);
					if (repo === 0) {
						return (
							new Date(b.pr.created_at).getTime() -
							new Date(a.pr.created_at).getTime()
						);
					}
					return repo;
				}
				return state;
			}
			return user;
		});

		el.classList.add("github-prs");

		const table = el.createEl("table", { cls: "github-prs-table" });

		const bottom = el.createEl("div", { cls: "github-prs-bottom" });
		bottom.createEl("span", { text: `Total results: ${prs.length}` });
		bottom.createEl("span", {
			text: `Last update: ${new Date().toLocaleString()}`,
		});

		const body = table.createEl("tbody");

		const header = body.createEl("tr");
		for (const column of githubPrsOptions.columns) {
			header.createEl("th", { text: column });
		}

		await Promise.all(
			prs.map(
				async ({
					pr,
					extraInfo: {
						author,
						createdBeforeMs,
						lastCommit,
						lastCommitBeforeMs,
					},
				}) => {
					const row = body.createEl("tr");
					for (const column of githubPrsOptions.columns) {
						switch (column) {
							case Column.AUTHOR: {
								row.createEl("td").createEl(
									"a",
									{
										href: `${pr.head.repo.html_url}/pulls/${author}`,
									},
									(a) => {
										a.text = author;
									},
								);
								break;
							}
							case Column.TITLE: {
								row.createEl("td", {
									text: pr.title,
								});
								break;
							}
							case Column.BRANCH: {
								row.createEl("td").createEl("a", { href: pr.html_url }, (a) => {
									a.text = pr.head.ref;
								});
								break;
							}
							case Column.CREATED: {
								row.createEl("td", {
									text: `${humanizeDuration(createdBeforeMs, {
										units:
											createdBeforeMs < 1000 * 60 * 60 * 24
												? ["h", "m"]
												: ["mo", "d"],
										maxDecimalPoints: 0,
									})} ago`,
								});
								break;
							}
							case Column.LAST_COMMIT: {
								row
									.createEl("td")
									.createEl("a", { href: lastCommit.html_url }, (a) => {
										a.text = `${humanizeDuration(lastCommitBeforeMs, {
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
										a.text = pr.base.repo.name;
									});
								break;
							}
							case Column.STATUS: {
								row.createEl("td", { text: pr.state, cls: "pr-status" });
								break;
							}
						}
					}
				},
			),
		);
	};
}
