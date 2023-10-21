import _ from "lodash";
import { Column, Properties, State } from "../constants";
import { GithubPrsOptions } from "../types";

export function GetPropertyValue(options: {
	source: string;
	property: Properties.COLUMNS;
	errors: string[];
	validOrgs: string[];
	validRepos: string[];
}): Column[];
export function GetPropertyValue(options: {
	source: string;
	property: Properties.STATE;
	errors: string[];
	validOrgs: string[];
	validRepos: string[];
}): State;
export function GetPropertyValue(options: {
	source: string;
	property: Properties.AUTHOR;
	errors: string[];
	validOrgs: string[];
	validRepos: string[];
}): string;
export function GetPropertyValue(options: {
	source: string;
	property: Properties.ORG;
	errors: string[];
	validOrgs: string[];
	validRepos: string[];
}): string;
export function GetPropertyValue(options: {
	source: string;
	property: Properties.REPO;
	errors: string[];
	validOrgs: string[];
	validRepos: string[];
}): string;
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
	validOrgs: string[];
	validRepos: string[];
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
									}
									return Object.values(Column).find((c1) => c1 === c) ?? [];
								}),
						);
						columns.forEach((column) => {
							if (!column.trim()) {
								errors.push(
									`Column "${column}" is not valid. Please check your spelling`,
								);
							}
						});
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
					case Properties.REPO: {
						const repo = validRepos.find((repo) => repo === value);
						if (repo) {
							return repo;
						}
						errors.push(
							`Repo "${value}" is not valid. valid repos are: ${validRepos.join(
								", ",
							)}`,
						);
					}
					case Properties.AUTHOR:
						return value;
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
