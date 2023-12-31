import humanizeDuration from "humanize-duration";
import JiraApi from "jira-client";
import _ from "lodash";
import { App, MarkdownPostProcessorContext } from "obsidian";
import * as Octokit from "octokit";
import { Column, Properties } from "../constants";
import { GithubPrsOptions, JiraIssueResponse, Settings } from "../types";
import { GetPropertyValue } from "./parser";

export const JIRA_STATUS_COLOR_MAP: Record<string, string> = {
	"blue-gray": "is-info",
	yellow: "is-warning",
	green: "is-success",
	red: "is-danger",
	"medium-gray": "is-dark",
};

export function githubPrsCodeBlockProcessor(
	app: App,
	settings: Settings,
	octokit: Octokit.Octokit,
	jiraApi?: JiraApi,
): (
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext,
) => void | Promise<unknown> {
	function getTheme(): string {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const obsidianTheme = (app.vault as any).getConfig("theme");
		if (obsidianTheme === "obsidian") {
			return "is-dark";
		} else if (obsidianTheme === "moonstone") {
			return "is-light";
		} else if (obsidianTheme === "system") {
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				return "is-dark";
			} else {
				return "is-light";
			}
		}
		return "is-light";
	}

	function renderAccountColorBand(
		title: string,
		color: string,
		parent: HTMLDivElement,
	) {
		createSpan({
			cls: `ji-tag ${getTheme()} ji-band`,
			attr: { style: `background-color: ${color}` },
			title,
			parent: parent,
		});
	}

	function renderIssue(issue: JiraIssueResponse, parent: HTMLElement) {
		const span = parent.createEl("span", {
			cls: "github-prs-jira-issue-badge ji-inline-issue jira-issue-container",
		});
		const tagsRow = span.createEl("div", { cls: "ji-tags has-addons" });
		renderAccountColorBand(
			issue.fields.summary,
			issue.fields.status.statusCategory.colorName,
			tagsRow,
		);
		if (issue.fields.issuetype.iconUrl) {
			createEl("img", {
				cls: "fit-content",
				attr: {
					src: issue.fields.issuetype.iconUrl,
					alt: issue.fields.issuetype.name,
				},
				title: issue.fields.issuetype.name,
				parent: createSpan({
					cls: `ji-tag ${getTheme()} ji-sm-tag`,
					parent: tagsRow,
				}),
			});
		}
		createEl("a", {
			cls: `ji-tag is-link ${getTheme()} no-wrap`,
			href: new URL(
				`https://${settings.jira.url}/browse/${issue.key}`,
			).toString(),
			title: new URL(
				`https://${settings.jira.url}/browse/${issue.key}`,
			).toString(),
			text: issue.key,
			parent: tagsRow,
		});
		createSpan({
			cls: `ji-tag ${getTheme()} issue-summary`,
			text: issue.fields.summary,
			parent: tagsRow,
		});
		const statusColor =
			JIRA_STATUS_COLOR_MAP[issue.fields.status.statusCategory.colorName] ||
			"is-light";
		createSpan({
			cls: `ji-tag no-wrap ${statusColor}`,
			text: issue.fields.status.name,
			title: issue.fields.status.description,
			attr: { "data-status": issue.fields.status.name },
			parent: tagsRow,
		});
	}

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

									const relatedIssuesKeys = _.uniq(
										[pr.body, pr.title, pr.head.ref].flatMap((text) => {
											if (!text) {
												return [];
											}
											const matches = text.match(
												new RegExp(`${settings.jira.issuePrefix}-\\d+`, "g"),
											);
											return matches ?? [];
										}),
									);

									const relatedJiraIssues = await Promise.all(
										relatedIssuesKeys.map((key) =>
											jiraApi
												? (jiraApi.findIssue(key) as Promise<JiraIssueResponse>)
												: undefined,
										),
									).then((r) =>
										r.filter((r): r is JiraIssueResponse => Boolean(r)),
									);

									return {
										pr,
										extraInfo: {
											...body,
											relatedJiraIssues,
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
						relatedJiraIssues,
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
							case Column.JIRA_ISSUES: {
								const div = row.createEl("td");
								for (const issue of relatedJiraIssues) {
									renderIssue(issue, div);
								}
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
