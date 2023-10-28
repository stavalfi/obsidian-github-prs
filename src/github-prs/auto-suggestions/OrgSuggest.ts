import {
	App,
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	TFile,
} from "obsidian";
import { Octokit } from "octokit";
import { PLUGIN_CODE_SECTION } from "../../../main";
import { Column, Properties, State } from "../../constants";
import { SuggestionEntry } from "../../types";
import { GetPropertyValue } from "../parser";

export class OrgSuggest extends EditorSuggest<SuggestionEntry> {
	constructor(app: App, private readonly octokit: Octokit) {
		super(app);
	}

	onTrigger(
		cursor: EditorPosition,
		editor: Editor,
		file: TFile,
	): EditorSuggestTriggerInfo | null {
		const cursorLine = editor.getLine(cursor.line);
		if (!cursorLine.trim().startsWith(`${Properties.ORG}:`)) {
			return null;
		}
		if (
			!cursorLine
				.substring(0, cursor.ch)
				.trim()
				.startsWith(`${Properties.ORG}:`)
		) {
			return null;
		}
		// check cursor inside githubx fence
		let isPluginCodeSection = false;
		for (let i = cursor.line - 1; i >= 0; i--) {
			const line = editor.getLine(i).trim();
			if (line === `\`\`\`${PLUGIN_CODE_SECTION}`) {
				isPluginCodeSection = true;
				break;
			}
		}
		if (!isPluginCodeSection) {
			return null;
		}

		const strBeforeCursor = cursorLine.substring(0, cursor.ch);
		const strAfterColumnsKey = strBeforeCursor.split(":").slice(1).join(":");
		const lastColumn = strAfterColumnsKey.split(",").pop() ?? "";

		return {
			start: { line: cursor.line, ch: cursor.ch - lastColumn.length },
			end: cursor,
			query: lastColumn,
		};
	}

	async getSuggestions(
		context: EditorSuggestContext,
	): Promise<SuggestionEntry[]> {
		const { data: orgs } =
			await this.octokit.rest.orgs.listForAuthenticatedUser();
		const allOrgs = orgs.map((org) => org.url.split("orgs/")[1] ?? org.url);

		const suggestions: SuggestionEntry[] = [];
		const query = context.query.trim().toUpperCase();
		for (const org of allOrgs) {
			if (suggestions.length >= this.limit) break;
			if (org.toLowerCase().trim().startsWith(query.toLowerCase().trim())) {
				suggestions.push({
					name: org,
				});
			}
		}

		return suggestions;
	}

	selectSuggestion(
		value: SuggestionEntry,
		evt: MouseEvent | KeyboardEvent,
	): void {
		if (!this.context) return;

		const selectedColumn = ` ${value.name}`;
		this.context.editor.replaceRange(
			selectedColumn,
			this.context.start,
			this.context.end,
			PLUGIN_CODE_SECTION,
		);
	}

	renderSuggestion(value: SuggestionEntry, el: HTMLElement): void {
		el.createSpan({
			text: value.name,
			cls: "github-extended-repos-suggestion",
		});
	}
}
