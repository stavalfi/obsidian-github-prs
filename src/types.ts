import { Column, State } from "./constants";

export interface Settings {
	githubToken: string;
	jira: {
		email: string;
		token: string;
		url: string;
		issuePrefix: string;
	};
}

export interface SuggestionEntry {
	name: string;
}

export type GithubPrsOptions = {
	org: string;
	repos: string[];
	authors: string[];
	columns: Column[];
	state: State;
};

export type JiraIssueResponse = {
	expand: string; // "renderedFields,names,schema,operations,editmeta,changelog,versionedRepresentations,customfield_10302.requestTypePractice";
	id: string; // "81922";
	self: string; // "https://papaya.atlassian.net/rest/api/2/issue/81922";
	key: string; // "PAP-35196";
	properties: {
		"scriptrunner.linkedissuesof": {
			typeAndIssue: [];
		};
		"scriptrunner.subtasks": {
			count: 0;
		};
		"scriptrunner.comments": {
			count: 0;
		};
		"scriptrunner.issuelinks": {
			types: [];
			count: 0;
			links: [];
		};
		"scriptrunner.syncdate": {
			date: string; // "2023-10-16T09:57:40Z";
		};
		"scriptrunner.sprintissues": {
			"added.after.board.sprint": [];
		};
		"scriptrunner.attachments": {
			count: 0;
			types: [];
			userNames: [];
		};
		"scriptrunner.worklogs": {
			count: 0;
			visible: {
				roles: [];
				groups: [];
			};
		};
	};
	fields: {
		resolution: null;
		customfield_10510: null;
		customfield_10500: string; // "*Goal:*\r\n\r\n*Description:*\r\n\r\n*Deliverables:*\r\n\r\n*Audience:*\r\n\r\n*Where (Where does the user encounter it?):*\r\n\r\n*When (when does the player see it?):*\r\n\r\n*Message & Basic Draft in your own words:*\r\n\r\n*Call To Action - (What do I want the user to do?):*\r\n\r\n*Is Copy Creative/Technical/Other:*\r\n\r\n*References:*\r\n";
		customfield_10501: null;
		customfield_10502: null;
		customfield_10504: null;
		customfield_10505: null;
		customfield_10506: null;
		customfield_10507: null;
		customfield_10508: null;
		customfield_10509: null;
		lastViewed: string; // "2023-10-29T00:29:23.077+0300";
		labels: [];
		aggregatetimeoriginalestimate: 28800;
		issuelinks: [];
		assignee: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/user?accountId=627b7db698eae500689e8c1f";
			accountId: string; // "627b7db698eae500689e8c1f";
			emailAddress: string; // "itayi@papaya.com";
			avatarUrls: {
				"48x48": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/48";
				"24x24": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/24";
				"16x16": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/16";
				"32x32": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/32";
			};
			displayName: string; // "Itay Iluz";
			active: true;
			timeZone: string; // "Asia/Jerusalem";
			accountType: string; // "atlassian";
		};
		components: [];
		subtasks: [];
		reporter: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/user?accountId=627b7db698eae500689e8c1f";
			accountId: string; // "627b7db698eae500689e8c1f";
			emailAddress: string; // "itayi@papaya.com";
			avatarUrls: {
				"48x48": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/48";
				"24x24": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/24";
				"16x16": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/16";
				"32x32": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/32";
			};
			displayName: string; // "Itay Iluz";
			active: true;
			timeZone: string; // "Asia/Jerusalem";
			accountType: string; // "atlassian";
		};
		progress: {
			progress: 0;
			total: 28800;
			percent: 0;
		};
		votes: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/issue/PAP-35196/votes";
			votes: 0;
			hasVoted: false;
		};
		worklog: {
			startAt: 0;
			maxResults: 20;
			total: 0;
			worklogs: [];
		};
		issuetype: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/issuetype/10001";
			id: string; // "10001";
			description: string; // "A task that needs to be done.";
			iconUrl: string; // "https://papaya.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/10726?size=medium";
			name: string; // "Dev Task";
			subtask: false;
			avatarId: 10726;
			hierarchyLevel: 0;
		};
		customfield_10390: null;
		customfield_10391: null;
		customfield_10392: null;
		customfield_10393: null;
		customfield_10394: null;
		project: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/project/10121";
			id: string; // "10121";
			key: string; // "PAP";
			name: string; // "Papaya";
			projectTypeKey: string; // "software";
			simplified: false;
			avatarUrls: {
				"48x48": string; // "https://papaya.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10586";
				"24x24": string; // "https://papaya.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10586?size=small";
				"16x16": string; // "https://papaya.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10586?size=xsmall";
				"32x32": string; // "https://papaya.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10586?size=medium";
			};
		};
		customfield_10395: null;
		customfield_10396: null;
		customfield_10397: null;
		customfield_10398: null;
		customfield_10399: null;
		resolutiondate: null;
		watches: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/issue/PAP-35196/watchers";
			watchCount: 3;
			isWatching: false;
		};
		customfield_10380: null;
		customfield_10381: null;
		customfield_10382: null;
		customfield_10383: null;
		customfield_10384: null;
		customfield_10022: [
			{
				id: 794;
				name: string; // "WIldcard Sprint 98";
				state: string; // "closed";
				boardId: 106;
				goal: string; // "Closing ends from Q3 (store sale; ; mini-bundles - packs ; secret sets and past albums fixes; Fallback reward)";
				startDate: string; // "2023-10-02T12:06:00.783Z";
				endDate: string; // "2023-10-16T09:52:00.000Z";
				completeDate: string; // "2023-10-16T09:50:44.785Z";
			},
			{
				id: 731;
				name: string; // "WIldcard Sprint 96";
				state: string; // "closed";
				boardId: 106;
				goal: string; // "- Internet Connectivity Issues popup\n- Shop sale UI\n- Collectibles Fallback Reward";
				startDate: string; // "2023-09-04T11:53:25.774Z";
				endDate: string; // "2023-09-18T09:52:00.000Z";
				completeDate: string; // "2023-09-18T11:15:51.153Z";
			},
			{
				id: 763;
				name: string; // "WIldcard Sprint 97";
				state: string; // "closed";
				boardId: 106;
				goal: string; // "-Collectibles in Cookie Cash";
				startDate: string; // "2023-09-18T11:36:07.481Z";
				endDate: string; // "2023-10-02T09:52:00.000Z";
				completeDate: string; // "2023-10-02T10:46:03.055Z";
			},
			{
				id: 811;
				name: string; // "WIldcard Sprint 99";
				state: string; // "active";
				boardId: 106;
				goal: string; // "Fallback Reward ; Communication pop-up; mini-bundles - Sets; Alternative trade flow\nMeta Design & Planning? (High level designs, UMLs, flow diagrams & APIs)";
				startDate: string; // "2023-10-16T12:06:23.261Z";
				endDate: string; // "2023-10-30T09:52:00.000Z";
			},
		];
		customfield_10385: null;
		customfield_10386: null;
		customfield_10023: string; // "2|hzzhnj:rzzzx";
		customfield_10387: null;
		customfield_10388: null;
		customfield_10026: null;
		customfield_10389: null;
		customfield_10379: null;
		customfield_10016: {
			hasEpicLinkFieldDependency: false;
			showField: false;
			nonEditableReason: {
				reason: string; // "EPIC_LINK_SHOULD_BE_USED";
				message: string; // "To set an epic as the parent, use the epic link instead";
			};
		};
		customfield_10017: null;
		customfield_10018: null;
		updated: string; // "2023-10-16T12:57:39.299+0300";
		customfield_10490: null;
		timeoriginalestimate: 28800;
		customfield_10491: null;
		customfield_10492: null;
		customfield_10493: null;
		description: string; // "I want to prepare an organized plan for covering major parts of the backend code with Stav.\n\nThis is a task to handle that + a placeholder for the onboarding with Stav.";
		customfield_10494: null;
		customfield_10373: null;
		customfield_10374: null;
		customfield_10495: null;
		customfield_10496: null;
		customfield_10375: null;
		customfield_10497: null;
		customfield_10377: null;
		customfield_10498: null;
		timetracking: {
			originalEstimate: string; // "1d";
			remainingEstimate: string; // "1d";
			originalEstimateSeconds: 28800;
			remainingEstimateSeconds: 28800;
		};
		customfield_10499: null;
		customfield_10378: null;
		summary: string; // "Onboarding For Stav Alfi";
		customfield_10480: null;
		customfield_10481: null;
		customfield_10483: null;
		customfield_10000: null;
		customfield_10485: null;
		customfield_10001: null;
		customfield_10003: string; // "{}";
		customfield_10488: null;
		customfield_10367: null;
		customfield_10478: null;
		customfield_10357: null;
		customfield_10599: null;
		customfield_10479: null;
		customfield_10359: null;
		environment: null;
		duedate: null;
		comment: {
			comments: [];
			self: string; // "https://papaya.atlassian.net/rest/api/2/issue/81922/comment";
			maxResults: 0;
			total: 0;
			startAt: 0;
		};
		statuscategorychangedate: string; // "2023-09-18T16:11:21.132+0300";
		customfield_10591: null;
		customfield_10470: null;
		customfield_10592: null;
		customfield_10471: null;
		customfield_10472: null;
		customfield_10351: null;
		fixVersions: [];
		customfield_10352: null;
		customfield_10473: null;
		customfield_10474: null;
		customfield_10595: null;
		customfield_10475: null;
		customfield_10596: null;
		customfield_10476: null;
		customfield_10477: null;
		customfield_10598: null;
		customfield_10346: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/customFieldOption/10175";
			value: string; // "No";
			id: string; // "10175";
		};
		customfield_10588: null;
		customfield_10589: null;
		customfield_10347: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/customFieldOption/10178";
			value: string; // "No";
			id: string; // "10178";
		};
		customfield_10469: null;
		customfield_10580: null;
		customfield_10460: null;
		customfield_10340: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/customFieldOption/10170";
			value: string; // "Not Verified";
			id: string; // "10170";
		};
		customfield_10582: null;
		customfield_10461: string; // "https://papaya.atlassian.net/l/cp/Q0bGjUfd";
		customfield_10583: null;
		customfield_10462: string; // "https://papaya.atlassian.net/l/cp/66xEbuuq";
		customfield_10341: null;
		priority: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/priority/10001";
			iconUrl: string; // "https://papaya.atlassian.net/images/icons/priorities/critical.svg";
			name: string; // "Top";
			id: string; // "10001";
		};
		customfield_10584: null;
		customfield_10342: [
			{
				self: string; // "https://papaya.atlassian.net/rest/api/2/user?accountId=5e1d7c2e2f2d9a0ca50bd3d8";
				accountId: string; // "5e1d7c2e2f2d9a0ca50bd3d8";
				emailAddress: string; // "guy@papaya.com";
				avatarUrls: {
					"48x48": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5e1d7c2e2f2d9a0ca50bd3d8/60d4a46b-4ffd-49f1-8331-2ab46508261f/48";
					"24x24": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5e1d7c2e2f2d9a0ca50bd3d8/60d4a46b-4ffd-49f1-8331-2ab46508261f/24";
					"16x16": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5e1d7c2e2f2d9a0ca50bd3d8/60d4a46b-4ffd-49f1-8331-2ab46508261f/16";
					"32x32": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5e1d7c2e2f2d9a0ca50bd3d8/60d4a46b-4ffd-49f1-8331-2ab46508261f/32";
				};
				displayName: string; // "Guy Yarkoni";
				active: true;
				timeZone: string; // "Asia/Jerusalem";
				accountType: string; // "atlassian";
			},
		];
		customfield_10100: null;
		customfield_10463: string; // "https://papaya.atlassian.net/l/cp/6UN1YFTe";
		customfield_10464: null;
		customfield_10465: null;
		customfield_10586: null;
		customfield_10466: null;
		customfield_10345: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/customFieldOption/10173";
			value: string; // "No";
			id: string; // "10173";
		};
		customfield_10587: null;
		customfield_10456: null;
		customfield_10335: [
			{
				self: string; // "https://papaya.atlassian.net/rest/api/2/user?accountId=557058%3Ab48a7862-60ee-4668-bffa-f0f04d331f95";
				accountId: string; // "557058:b48a7862-60ee-4668-bffa-f0f04d331f95";
				emailAddress: string; // "alex@papaya.com";
				avatarUrls: {
					"48x48": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:b48a7862-60ee-4668-bffa-f0f04d331f95/4c91f55d-a406-40c3-a651-f5dc4eb84216/48";
					"24x24": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:b48a7862-60ee-4668-bffa-f0f04d331f95/4c91f55d-a406-40c3-a651-f5dc4eb84216/24";
					"16x16": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:b48a7862-60ee-4668-bffa-f0f04d331f95/4c91f55d-a406-40c3-a651-f5dc4eb84216/16";
					"32x32": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:b48a7862-60ee-4668-bffa-f0f04d331f95/4c91f55d-a406-40c3-a651-f5dc4eb84216/32";
				};
				displayName: string; // "Alex Liakhovetsky";
				active: true;
				timeZone: string; // "Asia/Jerusalem";
				accountType: string; // "atlassian";
			},
			{
				self: string; // "https://papaya.atlassian.net/rest/api/2/user?accountId=557058%3A24d9785c-d9fb-41fe-b6da-33f6baf84a8f";
				accountId: string; // "557058:24d9785c-d9fb-41fe-b6da-33f6baf84a8f";
				emailAddress: string; // "andrey@papaya.com";
				avatarUrls: {
					"48x48": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:24d9785c-d9fb-41fe-b6da-33f6baf84a8f/caaa1501-e972-4a01-8372-1f7718f8cec9/48";
					"24x24": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:24d9785c-d9fb-41fe-b6da-33f6baf84a8f/caaa1501-e972-4a01-8372-1f7718f8cec9/24";
					"16x16": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:24d9785c-d9fb-41fe-b6da-33f6baf84a8f/caaa1501-e972-4a01-8372-1f7718f8cec9/16";
					"32x32": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:24d9785c-d9fb-41fe-b6da-33f6baf84a8f/caaa1501-e972-4a01-8372-1f7718f8cec9/32";
				};
				displayName: string; // "Andrey Birman";
				active: true;
				timeZone: string; // "Asia/Jerusalem";
				accountType: string; // "atlassian";
			},
		];
		customfield_10336: null;
		customfield_10457: null;
		customfield_10579: null;
		customfield_10458: null;
		customfield_10459: null;
		timeestimate: 28800;
		versions: [];
		status: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/status/3";
			description: string; // "This issue is being actively worked on at the moment by the assignee.";
			iconUrl: string; // "https://papaya.atlassian.net/images/icons/statuses/inprogress.png";
			name: string; // "In Progress";
			id: string; // "3";
			statusCategory: {
				self: string; // "https://papaya.atlassian.net/rest/api/2/statuscategory/4";
				id: 4;
				key: string; // "indeterminate";
				colorName: string; // "yellow";
				name: string; // "In Progress";
			};
		};
		customfield_10570: null;
		customfield_10571: null;
		customfield_10450: null;
		customfield_10330: null;
		customfield_10572: null;
		customfield_10451: null;
		customfield_10331: null;
		customfield_10573: null;
		customfield_10452: null;
		customfield_10332: null;
		customfield_10453: null;
		customfield_10574: null;
		customfield_10333: null;
		customfield_10455: null;
		customfield_10334: null;
		customfield_10445: null;
		customfield_10566: null;
		customfield_10446: null;
		customfield_10567: null;
		customfield_10447: null;
		customfield_10327: null;
		customfield_10448: null;
		aggregatetimeestimate: 28800;
		customfield_10449: null;
		customfield_10329: null;
		creator: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/user?accountId=627b7db698eae500689e8c1f";
			accountId: string; // "627b7db698eae500689e8c1f";
			emailAddress: string; // "itayi@papaya.com";
			avatarUrls: {
				"48x48": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/48";
				"24x24": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/24";
				"16x16": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/16";
				"32x32": string; // "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/627b7db698eae500689e8c1f/1e0c85fa-c5ea-4e33-ab73-c6b341574ebb/32";
			};
			displayName: string; // "Itay Iluz";
			active: true;
			timeZone: string; // "Asia/Jerusalem";
			accountType: string; // "atlassian";
		};
		customfield_10561: null;
		aggregateprogress: {
			progress: 0;
			total: 28800;
			percent: 0;
		};
		customfield_10440: null;
		customfield_10441: null;
		customfield_10562: string; // "https://papaya.atlassian.net/l/cp/6vmezpq2";
		customfield_10200: null;
		customfield_10443: null;
		customfield_10444: null;
		customfield_10565: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/customFieldOption/10702";
			value: string; // "Code Review Needed";
			id: string; // "10702";
		};
		customfield_10434: null;
		customfield_10313: null;
		customfield_10435: null;
		customfield_10314: null;
		customfield_10436: null;
		customfield_10315: null;
		customfield_10437: null;
		customfield_10316: null;
		customfield_10438: null;
		customfield_10317: null;
		customfield_10439: null;
		customfield_10319: null;
		timespent: null;
		customfield_10430: null;
		aggregatetimespent: null;
		customfield_10431: null;
		customfield_10310: null;
		customfield_10432: null;
		customfield_10433: null;
		customfield_10312: {
			self: string; // "https://papaya.atlassian.net/rest/api/2/customFieldOption/10480";
			value: string; // "Dev Wildcard";
			id: string; // "10480";
		};
		customfield_10302: null;
		customfield_10424: null;
		customfield_10303: [];
		customfield_10304: null;
		customfield_10425: null;
		customfield_10426: null;
		customfield_10305: null;
		customfield_10427: null;
		customfield_10306: null;
		customfield_10307: null;
		customfield_10428: null;
		customfield_10429: null;
		customfield_10308: null;
		customfield_10309: null;
		workratio: 0;
		issuerestriction: {
			issuerestrictions: {};
			shouldDisplay: false;
		};
		created: string; // "2023-09-10T13:26:58.461+0300";
		customfield_10420: null;
		customfield_10300: null;
		customfield_10421: null;
		customfield_10301: null;
		customfield_10422: null;
		customfield_10412: null;
		customfield_10413: null;
		customfield_10534: null;
		customfield_10414: null;
		customfield_10535: string; // "Required Analysis Sections:\r\n- KPI Breakdown, Split the KPI to numerator and denominator and drill down until you identify the underline KPI performance issue\r\n- AB Tests Effects\r\n- New App Versions Effect\r\n- LOC Effects\r\n- Marketing Effect\r\n- Other Effects";
		customfield_10419: null;
		customfield_10401: null;
		customfield_10522: null;
		customfield_10523: null;
		customfield_10402: [];
		customfield_10524: null;
		security: null;
		customfield_10403: null;
		customfield_10404: null;
		customfield_10525: null;
		customfield_10405: null;
		customfield_10526: null;
		attachment: [];
		customfield_10406: null;
		customfield_10527: null;
		customfield_10407: null;
		customfield_10528: null;
		customfield_10408: null;
		customfield_10409: null;
		customfield_10400: null;
		customfield_10511: null;
		customfield_10512: null;
		customfield_10513: null;
		customfield_10514: null;
		customfield_10515: null;
		customfield_10516: null;
		customfield_10517: null;
	};
};
