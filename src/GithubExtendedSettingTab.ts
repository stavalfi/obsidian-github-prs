import { App, PluginSettingTab, Setting } from "obsidian";
import GithubPrsPlugin from "../main";

export class GithubPrsSettingTab extends PluginSettingTab {
	constructor(app: App, private readonly plugin: GithubPrsPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Github Token")
			.setDesc("read-only: orgs, repos, prs, commits")
			.addText((text) =>
				text
					.setPlaceholder("After - Restart Obsidian")
					.setValue(this.plugin.settings.githubToken)
					.onChange(async (value) => {
						this.plugin.settings.githubToken = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl).setName("Jira Url").addText((text) =>
			text
				.setPlaceholder("After - Restart Obsidian")
				.setValue(this.plugin.settings.jira.url)
				.onChange(async (value) => {
					this.plugin.settings.jira.url = value
						.replace("https://", "")
						.replace("http://", "");
					await this.plugin.saveSettings();
				}),
		);

		new Setting(containerEl).setName("Jira Email Or Username").addText((text) =>
			text
				.setPlaceholder("After - Restart Obsidian")
				.setValue(this.plugin.settings.jira.email)
				.onChange(async (value) => {
					this.plugin.settings.jira.email = value;
					await this.plugin.saveSettings();
				}),
		);

		new Setting(containerEl).setName("Jira Token").addText((text) =>
			text
				.setPlaceholder("After - Restart Obsidian")
				.setValue(this.plugin.settings.jira.token)
				.onChange(async (value) => {
					this.plugin.settings.jira.token = value;
					await this.plugin.saveSettings();
				}),
		);

		new Setting(containerEl).setName("Jira Issue Prefix").addText((text) =>
			text
				.setPlaceholder("After - Restart Obsidian")
				.setValue(this.plugin.settings.jira.issuePrefix)
				.onChange(async (value) => {
					this.plugin.settings.jira.issuePrefix = value;
					await this.plugin.saveSettings();
				}),
		);
	}
}
