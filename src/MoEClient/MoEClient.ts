import { Mastodon } from "../Mastodon";
import { MoEClientHelp } from "./MoEClientHelp";



/**
 * Mastodon on Emailのクライエントクラス
 * 
 * @extends Mastodon
 * @author Genbu Hase
 */
export class MoEClient extends Mastodon {
	/** MoE専用のメール件名フォーマット */
	public static readonly SubjectMatcher = /MoE(:[^@<]+(?=[@<]))?(?:<(.+)>)?@(.*)/;

	/** 本文で使用できる特殊構文フォーマット */
	public static readonly MagicMatcher = {
		CW: /\[CW ?\| ?(.+)\]\r?\n/i,
		Emoji: /\[(:[^:]+:) ?\| ?([^\]]+)\]/
	};



	public constructor (public instance: string) { super(instance); }

	public readonly Help = MoEClientHelp;

	/** 紐付けられたインスタンスにトゥートします */
	public toot (text: Mastodon.TootOptions["status"], visibility: Mastodon.TootOptions["visibility"]): GoogleAppsScript.URL_Fetch.HTTPResponse {
		const cw: RegExpMatchArray = text.match(MoEClient.MagicMatcher.CW) || [""];
		text = text.replace(cw[0], "");

		const emojis: RegExpMatchArray = text.match(new RegExp(MoEClient.MagicMatcher.Emoji.source, "g")) || [];
		emojis.forEach(emojiStr => {
			const emoji: RegExpMatchArray = emojiStr.match(MoEClient.MagicMatcher.Emoji);
			text = text.replace(emoji[0], `${emoji[1]} `.repeat(parseInt(emoji[2], 10)));
		});

		const options: Mastodon.TootOptions = {
			status: [
				text,
				"",
				"from #MoE",
				"#MastodonOnEmail"
			].join("\n"),

			visibility
		};

		return this.post("api/v1/statuses", options);
	}
}

export namespace MoEClient {
	export type MoEFeatures = [":Toot", ":Notify", ":Help"];

	/** MoEへのリクエスト */
	export interface MoERequest {
		feature: MoEFeatures[number] | string;
		args: string[];
		instance: string;

		/** For Toot mode */
		toot_visibility?: Mastodon.TootOptions["visibility"];
		/** For Notify mode */
		notify_types?: string[];
		/** For Help mode */
		help_language?: string;
		help_feature?: MoERequest["feature"];
	}

	export class Utils {
		/** メールの件名からMoEリクエストに変換したものを返します */
		public static getRequest (subjectStr: string): MoERequest {
			const subject: RegExpMatchArray = subjectStr.match(MoEClient.SubjectMatcher) || [];
			
			const request: MoERequest = {
				feature: (subject[1] || "").toUpperCase(),
				args: subject[2] && subject[2].split(/ ?\| ?/) || [],
				instance: subject[3] || "",
			};

			const { feature, args } = request;

			switch (feature) {
				default:
				case ":TOOT":
					const { Visibilities } = Mastodon;

					request.toot_visibility = args[0] && (!isNaN(parseInt(args[0], 10)) ? Visibilities[parseInt(args[0], 10)] : args[0]) || Visibilities[0];
					break;

				case ":NOTIFY":

					break;

				case ":HELP":
					const { defaultLanguage } = MoEClientHelp;

					request.help_language = args[0] && (MoEClientHelp.isLangRegistered(args[0]) && args[0]) || defaultLanguage;
					request.help_feature = args[1] && (MoEClientHelp.isFeatureRegistered(args[1]) && args[1]) || null;
					break;
			}

			return request;
		}

		/** HTML形式の文字列をパースして、生の文字列にして返します */
		public static parseHtml (htmlStr: string): string {
			return htmlStr
				.replace(/(<\/p>)/g, "$1\n\n")
				.replace(/<br ?\/?>/g, "\n")
				.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
				.slice(0, -2);
		}
	}
}