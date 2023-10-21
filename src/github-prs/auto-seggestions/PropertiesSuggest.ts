import {
	Editor,
	EditorPosition,
	EditorSuggest,
	EditorSuggestContext,
	EditorSuggestTriggerInfo,
	TFile,
} from "obsidian";
import { PLUGIN_CODE_SECTION } from "../../../main";
import { Column, Properties } from "../../constants";
import { SuggestionEntry } from "../../types";
import { githubPrsCodeBlockProcessor } from "../code-block-processor";
import { GetPropertyValue } from "../parser";

export class PropertiesSuggest extends EditorSuggest<SuggestionEntry> {
	onTrigger(
		cursor: EditorPosition,
		editor: Editor,
		file: TFile,
	): EditorSuggestTriggerInfo | null {
		const cursorLine = editor.getLine(cursor.line);
		// check line contains prefix "columns:"
		if (cursorLine.includes(":")) {
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

		const query = cursorLine.substring(0, cursor.ch).trim();

		return {
			start: { line: cursor.line, ch: 0 },
			end: cursor,
			query,
		};
	}

	getSuggestions(
		context: EditorSuggestContext,
	): SuggestionEntry[] | Promise<SuggestionEntry[]> {
		const suggestions: SuggestionEntry[] = [];
		const query = context.query.trim().toUpperCase();
		for (const propertyName of Object.values(Properties)) {
			if (suggestions.length >= this.limit) break;
			if (
				propertyName.toLowerCase().trim().startsWith(query.toLowerCase().trim())
			) {
				suggestions.push({
					name: propertyName,
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

		const selectedColumn = `${value.name}: `;
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
			cls: "github-extended-properties-suggestion",
		});
	}
}
