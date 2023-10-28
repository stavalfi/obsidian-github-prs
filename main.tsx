import _ from "lodash";
import { Plugin } from "obsidian";
import * as Octokit from "octokit";
import { GithubExtendedSettingTab } from "./src/GithubExtendedSettingTab";
import { ColumnsSuggest } from "./src/github-prs/auto-suggestions/ColumnsSuggest";
import { OrgSuggest } from "./src/github-prs/auto-suggestions/OrgSuggest";
import { PropertiesSuggest } from "./src/github-prs/auto-suggestions/PropertiesSuggest";
import { ReposSuggest } from "./src/github-prs/auto-suggestions/ReposSuggest";
import { StateSuggest } from "./src/github-prs/auto-suggestions/StateSuggest";
import { githubPrsCodeBlockProcessor } from "./src/github-prs/code-block-processor";

export const PLUGIN_CODE_SECTION = "github-prs";

interface Settings {
	githubToken: string;
}

const DEFAULT_SETTINGS: Settings = {
	githubToken: "",
};

export default class GithubPrsPlugin extends Plugin {
	settings: Settings;

	private octokit: Octokit.Octokit;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new GithubExtendedSettingTab(this.app, this));

		this.octokit = new Octokit.Octokit({
			auth: this.settings.githubToken,
		});

		this.app.workspace.onLayoutReady(() => {
			this.registerEditorSuggest(new PropertiesSuggest(this.app));
			this.registerEditorSuggest(new ColumnsSuggest(this.app));
			this.registerEditorSuggest(new StateSuggest(this.app));
			this.registerEditorSuggest(new OrgSuggest(this.app, this.octokit));
			this.registerEditorSuggest(new ReposSuggest(this.app, this.octokit));
		});

		this.registerMarkdownCodeBlockProcessor(
			"github-prs",
			githubPrsCodeBlockProcessor(this.octokit),
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
