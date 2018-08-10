/**
 * Mastodonインスタンスとの通信を行うクラス
 * @author Genbu Hase
 */
export class Mastodon {
	/** @param instance Mastodonインスタンスのドメイン (ex: itabashi.0j0.jp) */
	public constructor (public instance: string) {
		this.token = UserProperties.getProperty(instance);
	}

	/** インスタンスと紐付けられたトークン */
	public token: string;

	/**
	 * application/json形式でGET通信を行います
	 * 
	 * @param apiUrl エンドポイントのURL
	 * @param params クエリパラメータ (ex: { id: 1, "exclude_types[]": [ "reblog", "favourite" ] })
	 */
	public get (apiUrl: string, params: object = {}): GoogleAppsScript.URL_Fetch.HTTPResponse {
		const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
			method: "get",
			headers: {
				"Authorization": `Bearer ${this.token}`,
				"Content-Type": "application/json"
			}
		};

		const paramStrs: string[] = [];
		for (const name in params) {
			const param: any = params[name];

			if (Array.isArray(param)) {
				param.forEach(prop => paramStrs.push(`${name}=${prop}`));
			} else {
				paramStrs.push(`${name}=${param}`);
			}
		}

		return UrlFetchApp.fetch(`https://${this.instance}/${apiUrl}${params.length ? `?${paramStrs.join("&")}`: ""}`, options);
	}

	/**
	 * application/json形式でPOST通信を行います
	 * 
	 * @param apiUrl エンドポイントのURL
	 * @param payload 送信するデータ
	 */
	public post (apiUrl: string, payload: object = {}): GoogleAppsScript.URL_Fetch.HTTPResponse {
		const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
			method: "post",
			headers: {
				"Authorization": `Bearer ${this.token}`,
				"Content-Type": "application/json"
			},

			payload: JSON.stringify(payload)
		};

		return UrlFetchApp.fetch(`https://${this.instance}/${apiUrl}`, options);
	}
}

export namespace Mastodon {
	export namespace Accounts {
		/** See https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#account */
		export type Account = {
			id: number;
			username: string;
			acct: string;
			display_name: string;
			locked: boolean;
			created_at: number;
			followers_count: number;
			following_count: number;
			statuses_count: number;
			note: string;
			url: string;
			avatar: string;
			avatar_static: string;
			header: string;
			header_static: string;
			moved?: Account;
			fields?: object[];
			bot?: boolean;
		};
	}

	export namespace Statuses {
		/** See https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#status */
		export type Status = {
			id: number;
			uri: string;
			url?: string;
			account: Accounts.Account;
			in_reply_to_id?: number;
			in_reply_to_account_id?: number;
			reblog?: Status;
			content: string;
			created_at: number;
			emojis: object[];
			reblogs_count: number;
			favourites_count: number;
			reblogged?: boolean;
			favourited?: boolean;
			muted?: boolean;
			sensitive: boolean;
			spoiler_text: string;
			visibility: StatusVisibility[number] | string;
			media_attachments: object[];
			mentions: object[];
			tags: object[];
			application?: object;
			language?: string;
			pinned: boolean;
		};

		/** 標準実装されているトゥートの公開範囲 */
		export type StatusVisibility = ["public", "unlisted", "private", "direct"];



		/** See https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#posting-a-new-status */
		export type TootPayload = {
			status: string;
			in_reply_to_id?: Status["in_reply_to_id"];
			media_ids?: number[];
			sensitive?: Status["sensitive"];
			spoiler_text?: Status["spoiler_text"];
			visibility?: Status["visibility"];
			language?: string;
		};
	}

	export namespace Notifications {
		/** See https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#notification */
		export type Notification = {
			id: number;
			type: NotificationTypes[number] | string;
			created_at: number;
			account: Accounts.Account;
			status?: Statuses.Status
		};

		/** 標準実装されている通知の種類 */
		export type NotificationTypes = ["follow", "favourite", "reblog", "mention"];



		/** See https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#fetching-a-users-notifications */
		export type GetListParams = {
			max_id?: number;
			since_id?: number;
			limit?: number;
			"exclude_types[]"?: Notification["type"][];
		};
	}
}