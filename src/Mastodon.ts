/**
 * Mastodonインスタンスとの通信を行うクラス
 * @author Genbu Hase
 */
export class Mastodon {
	/** 標準実装されているトゥートの公開範囲 */
	public static readonly Visibilities: Mastodon.TootVisibility = ["public", "unlisted", "private", "direct"];



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
				return;
			}

			paramStrs.push(`${name}=${param}`);
		}

		return UrlFetchApp.fetch(`https://${this.instance}/${apiUrl}${paramStrs.length ? `?${paramStrs.join("&")}`: ""}`, options);
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
	/**
	 * See https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#posting-a-new-status
	 */
	export interface TootOptions {
		status: string;
		in_reply_to_id?: number;
		media_ids?: number[];
		sensitive?: boolean;
		spoiler_text?: string;
		visibility?: TootVisibility[number] | string;
		language?: string;
	}

	export type TootVisibility = ["public", "unlisted", "private", "direct"];
}