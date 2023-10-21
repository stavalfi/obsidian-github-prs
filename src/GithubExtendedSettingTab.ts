import { App, PluginSettingTab, Setting } from "obsidian";
import GithubExtendedPlugin from "../main";

export class GithubExtendedSettingTab extends PluginSettingTab {
	constructor(app: App, private readonly plugin: GithubExtendedPlugin) {
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
					.setPlaceholder("Enter Github Token and restart obsitian")
					.setValue(this.plugin.settings.githubToken)
					.onChange(async (value) => {
						this.plugin.settings.githubToken = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
