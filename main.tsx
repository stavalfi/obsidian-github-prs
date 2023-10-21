import humanizeDuration from "humanize-duration";
import _ from "lodash";
import {
	App,
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	MarkdownPostProcessorContext,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";
import * as Octokit from "octokit";
import { createRoot } from "react-dom/client";
import { GithubExtendedSettingTab } from "./src/GithubExtendedSettingTab";
import { Column, Properties } from "./src/constants";
import { ColumnsSuggest } from "./src/github-prs/auto-seggestions/ColumnsSuggest";
import { OrgSuggest } from "./src/github-prs/auto-seggestions/OrgSuggest";
import { PropertiesSuggest } from "./src/github-prs/auto-seggestions/PropertiesSuggest";
import { RepoSuggest } from "./src/github-prs/auto-seggestions/RepoSuggest";
import { StateSuggest } from "./src/github-prs/auto-seggestions/StateSuggest";
import { githubPrsCodeBlockProcessor } from "./src/github-prs/code-block-processor";
import { GetPropertyValue } from "./src/github-prs/parser";
import { GithubPrsOptions } from "./src/types";

export const PLUGIN_CODE_SECTION = "github-prs";

// // Clear the existing HTML content
// document.body.innerHTML = '<div id="app"></div>';

// // Render your React component instead
// const root = createRoot(document.getElementById('app'));
// root.render(<h1>Hello, world</h1>);

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	githubToken: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	githubToken: "",
};

const ALL_EMOJIS: Record<string, string> = {
	":+22:": "👍",
	":sunglasses:": "😎",
	":smile:": "😄",
};

export default class GithubExtendedPlugin extends Plugin {
	settings: MyPluginSettings;

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
			this.registerEditorSuggest(new RepoSuggest(this.app, this.octokit));
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
