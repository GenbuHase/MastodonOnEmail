/**
 * See https://github.com/tootsuite/documentation/blob/master/Using-the-API/API.md#posting-a-new-status
 */
interface TootOptions {
	status: string;
	in_reply_to_id?: number;
	media_ids?: number[];
	sensitive?: boolean;
	spoiler_text?: string;
	visibility?: "public" | "unlisted" | "private" | "direct" | string;
	language?: string;
}



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



/**
 * Mastodon on Emailのクライエントクラス
 * 
 * @extends Mastodon
 * @author Genbu Hase
 */
export class MoEClient extends Mastodon {
	public static readonly SubjectMatcher = /MoE(:[^@<>]+(?=@))?@([^<>]*)(?:<(.+)>)?/;

	public static readonly MagicMatcher = {
		CW: /\[CW ?\| ?(.+)\]\r?\n/i,
		Emoji: /\[(:[^:]+:) ?\| ?([^\]]+)\]/
	};

	public static readonly Utils = class MoEClientUtils {
		public static parseHtml (htmlStr: string): string {
			return htmlStr
				.replace(/(<\/p>)/g, "$1\n\n")
				.replace(/<br ?\/?>/g, "\n")
				.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
				.slice(0, -2);
		}
	};



	public constructor (public instance: string) { super(instance); }

	public toot (text: TootOptions["status"], visibility: TootOptions["visibility"]): GoogleAppsScript.URL_Fetch.HTTPResponse {
		const cw: RegExpMatchArray = text.match(MoEClient.MagicMatcher.CW) || [""];
		text = text.replace(cw[0], "");

		const emojis: RegExpMatchArray = text.match(new RegExp(MoEClient.MagicMatcher.Emoji.source, "g")) || [];
		emojis.forEach(emojiStr => {
			const emoji: RegExpMatchArray = emojiStr.match(MoEClient.MagicMatcher.Emoji);
			text = text.replace(emoji[0], `${emoji[1]} `.repeat(parseInt(emoji[2], 10)));
		});

		const options: TootOptions = {
			status: [
				text,
				"",
				"from #MoE",
				"#MastodonOnEmail"
			].join("\r\n"),

			visibility
		};

		return this.post("api/v1/statuses", options);
	}
}