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
import { GetPropertyValue } from "../parser";

export class ColumnsSuggest extends EditorSuggest<SuggestionEntry> {
	private cachedSelectedColumns: Column[] = [];

	onTrigger(
		cursor: EditorPosition,
		editor: Editor,
		file: TFile,
	): EditorSuggestTriggerInfo | null {
		const cursorLine = editor.getLine(cursor.line);
		// check line contains prefix "columns:"
		if (!cursorLine.trim().startsWith(`${Properties.COLUMNS}:`)) {
			return null;
		}
		// check cursor is after "columns:"
		if (
			!cursorLine
				.substring(0, cursor.ch)
				.trim()
				.startsWith(`${Properties.COLUMNS}:`)
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

		this.cachedSelectedColumns = GetPropertyValue({
			errors: [],
			property: Properties.COLUMNS,
			source: cursorLine,
			validOrgs: [],
			validRepos: [],
		});

		return {
			start: { line: cursor.line, ch: cursor.ch - lastColumn.length },
			end: cursor,
			query: lastColumn,
		};
	}

	getSuggestions(
		context: EditorSuggestContext,
	): SuggestionEntry[] | Promise<SuggestionEntry[]> {
		const suggestions: SuggestionEntry[] = [];
		const query = context.query.trim().toUpperCase();
		for (const column of Object.values(Column)) {
			if (suggestions.length >= this.limit) break;
			if (
				!this.cachedSelectedColumns.includes(column) &&
				column.toLowerCase().trim().startsWith(query.toLowerCase().trim())
			) {
				suggestions.push({
					name: column,
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

		const selectedColumn = ` ${value.name}, `;
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
			cls: "github-extended-columns-suggestion",
		});
	}
}
