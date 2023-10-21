import { Column, State } from "./constants";

export interface SuggestionEntry {
	name: string;
}

export type GithubPrsOptions = {
	org: string;
	repo: string;
	author: string;
	columns: Column[];
	state: State;
};
