import _ from "lodash";
import { Column, Properties, State } from "../constants";
import { GithubPrsOptions } from "../types";

export function GetPropertyValue(options: {
	source: string;
	property: Properties.COLUMNS;
	errors: string[];
	validOrgs?: string[];
	validRepos?: string[];
}): Column[];
export function GetPropertyValue(options: {
	source: string;
	property: Properties.STATE;
	errors: string[];
	validOrgs?: string[];
	validRepos?: string[];
}): State;
export function GetPropertyValue(options: {
	source: string;
	property: Properties.AUTHORs;
	errors: string[];
	validOrgs?: string[];
	validRepos?: string[];
}): string[];
export function GetPropertyValue(options: {
	source: string;
	property: Properties.ORG;
	errors: string[];
	validOrgs?: string[];
	validRepos?: string[];
}): string;
export function GetPropertyValue(options: {
	source: string;
	property: Properties.REPOS;
	errors: string[];
	validOrgs?: string[];
	validRepos?: string[];
}): string[];
export function GetPropertyValue({
	property,
	errors,
	source,
	validOrgs,
	validRepos,
}: {
	source: string;
	property: Properties;
	errors: string[];
	validOrgs?: string[];
	validRepos?: string[];
}): GithubPrsOptions[keyof GithubPrsOptions] | undefined {
	for (const line of source.split("\n")) {
		const propertyUnparsed = line.split(":")[0]?.trim();
		const value = line?.split(":")?.[1]?.trim();
		if (property === propertyUnparsed) {
			if (property) {
				switch (property) {
					case Properties.COLUMNS: {
						const columns = _.uniq(
							value
								.split(",")
								.map((c) => c.trim())
								.filter(Boolean)
								.flatMap((c) => {
									const r = Object.values(Column).find((c1) => c1 === c);
									if (r) {
										return r;
									} else {
										errors.push(
											`Column "${c}" is not valid. Allowed columns are: ${Object.values(
												Column,
											).join(", ")}`,
										);
										return [];
									}
								}),
						);
						return columns;
					}
					case Properties.STATE: {
						const state = Object.values(State).find((s) => s === value);
						if (state) {
							return state;
						}
						errors.push(
							`State "${value}" is not valid. valid states are: ${Object.values(
								State,
							).join(", ")}`,
						);
					}
					case Properties.ORG: {
						if (!validOrgs) {
							return value;
						}
						const org = validOrgs.find((org) => org === value);
						if (org) {
							return org;
						}
						errors.push(
							`Org "${value}" is not valid. valid orgs are: ${validOrgs.join(
								", ",
							)}`,
						);
					}
					case Properties.REPOS: {
						const repos = _.uniq(
							value
								.split(",")
								.map((c) => c.trim())
								.filter(Boolean)
								.flatMap((c) => {
									if (!validRepos) {
										return c;
									}
									const r = Object.values(validRepos).find((c1) => c1 === c);
									if (r) {
										return r;
									} else {
										errors.push(`Repo "${c}" is not valid`);
										return [];
									}
								}),
						);
						return repos;
					}
					case Properties.AUTHORs:
						return value
							.split(",")
							.map((c) => c.trim())
							.filter(Boolean);
				}
			}
		}
	}
	errors.push(
		`Property "${property}" is required. Allowed properties are: ${Object.values(
			Properties,
		).join(", ")}`,
	);
}
