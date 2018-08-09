import { Mastodon } from "../Mastodon";
import { MoEClient } from "./MoEClient";



/**
 * MoEClientのトゥート処理部分
 * @author Genbu Hase
 */
export class MoEClientToot {
	public static readonly Visibility: Mastodon.Statuses.StatusVisibility = ["public", "unlisted", "private", "direct"];



	public constructor (private client: MoEClient) {}

	/**
	 * 紐付けられたインスタンスにトゥートします
	 * 
	 * @param text 投稿内容
	 * @param visibility トゥートの公開範囲
	 */
	public toot (text: Mastodon.Statuses.TootPayload["status"], visibility: Mastodon.Statuses.TootPayload["visibility"]): GoogleAppsScript.URL_Fetch.HTTPResponse {
		const cw: RegExpMatchArray = text.match(MoEClient.MagicMatcher.CW) || [""];
		text = text.replace(cw[0], "");

		const emojis: RegExpMatchArray = text.match(new RegExp(MoEClient.MagicMatcher.Emoji.source, "g")) || [];
		emojis.forEach(emojiStr => {
			const emoji: RegExpMatchArray = emojiStr.match(MoEClient.MagicMatcher.Emoji);
			text = text.replace(emoji[0], `${emoji[1]} `.repeat(parseInt(emoji[2], 10)));
		});

		const payload: Mastodon.Statuses.TootPayload = {
			status: [
				text,
				"",
				"from #MoE",
				"#MastodonOnEmail"
			].join("\n"),

			visibility
		};

		return this.client.post("api/v1/statuses", payload);
	}
}

export namespace MoEClientToot {}