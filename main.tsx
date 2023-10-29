import JiraApi from "jira-client";
import _ from "lodash";
import { Plugin } from "obsidian";
import * as Octokit from "octokit";
import { GithubPrsSettingTab } from "./src/GithubExtendedSettingTab";
import { ColumnsSuggest } from "./src/github-prs/auto-suggestions/ColumnsSuggest";
import { OrgSuggest } from "./src/github-prs/auto-suggestions/OrgSuggest";
import { PropertiesSuggest } from "./src/github-prs/auto-suggestions/PropertiesSuggest";
import { ReposSuggest } from "./src/github-prs/auto-suggestions/ReposSuggest";
import { StateSuggest } from "./src/github-prs/auto-suggestions/StateSuggest";
import { githubPrsCodeBlockProcessor } from "./src/github-prs/code-block-processor";
import { JiraIssueResponse, Settings } from "./src/types";

export const PLUGIN_CODE_SECTION = "github-prs";

const DEFAULT_SETTINGS: Settings = {
	githubToken: "",
	jira: {
		email: "",
		token: "",
		url: "",
		issuePrefix: "",
	},
};

export default class GithubPrsPlugin extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new GithubPrsSettingTab(this.app, this));

		const octokit = new Octokit.Octokit({
			auth: this.settings.githubToken,
		});

		const jiraEnlabed = Boolean(
			this.settings.jira.email &&
				this.settings.jira.token &&
				this.settings.jira.url &&
				this.settings.jira.issuePrefix,
		);

		const jiraApi =
			(jiraEnlabed &&
				new JiraApi({
					protocol: "https",
					host: this.settings.jira.url,
					apiVersion: "2",
					strictSSL: true,
					username: this.settings.jira.email,
					password: this.settings.jira.token,
				})) ||
			undefined;

		this.app.workspace.onLayoutReady(() => {
			this.registerEditorSuggest(new PropertiesSuggest(this.app));
			this.registerEditorSuggest(new ColumnsSuggest(this.app));
			this.registerEditorSuggest(new StateSuggest(this.app));
			this.registerEditorSuggest(new OrgSuggest(this.app, octokit));
			this.registerEditorSuggest(new ReposSuggest(this.app, octokit));
		});

		this.registerMarkdownCodeBlockProcessor(
			"github-prs",
			githubPrsCodeBlockProcessor(this.app, this.settings, octokit, jiraApi),
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
