import { Column, State } from "./constants";

export interface SuggestionEntry {
	name: string;
}

export type GithubPrsOptions = {
	org: string;
	repos: string[];
	author: string;
	columns: Column[];
	state: State;
};
