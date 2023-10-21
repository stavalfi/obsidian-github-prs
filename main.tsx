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

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		const octokit = new Octokit.Octokit({
			auth: "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",
		});

		// Suggestion menu for columns inside jira-search fence
		this.app.workspace.onLayoutReady(() => {
			this.registerEditorSuggest(new PropertiesSuggest(this.app));
			this.registerEditorSuggest(new ColumnsSuggest(this.app));
			this.registerEditorSuggest(new StateSuggest(this.app));
		});

		const [{ data: orgs }, { data: repos }] = await Promise.all([
			octokit.rest.orgs.listForAuthenticatedUser(),
			octokit.rest.repos.listForAuthenticatedUser(),
		]);

		const allOrgs = orgs.map((org) => org.url.split("orgs/")[1] ?? org.url);
		const allRepos = repos.map((repo) => repo.name);

		this.app.workspace.onLayoutReady(() => {
			this.registerEditorSuggest(new OrgSuggest(this.app, allOrgs));
			this.registerEditorSuggest(new RepoSuggest(this.app, allRepos));
		});

		this.registerMarkdownCodeBlockProcessor(
			"github-prs",
			githubPrsCodeBlockProcessor(allOrgs, allRepos, octokit),
		);

		// Reading mode inline issue rendering
		// this.registerMarkdownPostProcessor(async (element, context) => {
		// 	element.innerHTML = element.innerHTML.replace(
		// 		/https:\/\/papaya\.atlassian\.net\/browse\/(PAP-\d+)/g,
		// 		"$1",
		// 	);
		// });

		// // This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon(
		// 	"dice",
		// 	"Sample Plugin",
		// 	(evt: MouseEvent) => {
		// 		// Called when the user clicks the icon.
		// 		new Notice("This is a notice! hahaah");
		// 	},
		// );
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass("my-plugin-ribbon-class");

		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText("Status Bar Text");

		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: "open-sample-modal-simple",
		// 	name: "Open sample modal (simple)",
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	},
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: "sample-editor-command",
		// 	name: "Sample editor command",
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection("Sample Editor Command");
		// 	},
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: "open-sample-modal-complex",
		// 	name: "Open sample modal (complex)",
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView =
		// 			this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	},
		// });

		// // This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new GithubExtendedSettingTab(this.app, this));

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log("stav1"), 1000));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export const InlineIssueRenderer = async (
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext,
) => {
	console.log("stav1", el.innerHTML);
};

class SampleModal extends Modal {
	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class GithubExtendedSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setName("General").addText((text) =>
			text
				.setPlaceholder("Enter Github Token")
				.setValue(this.plugin.settings.githubToken)
				.onChange(async (value) => {
					this.plugin.settings.githubToken = value;
					await this.plugin.saveSettings();
				}),
		);
	}
}
