import { Mastodon } from "../Mastodon";
import { MoEClientToot } from "./MoEClientToot";
import { MoEClientNotify } from "./MoEClientNotify";
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

	public readonly Help = new MoEClientHelp(this);
	public readonly Notify = new MoEClientNotify(this);
	public readonly Toot = new MoEClientToot(this);
}

export namespace MoEClient {
	/** MoEで定義済みの機能 */
	export type MoEFeatures = [":Toot", ":Notify", ":Help"];

	/** MoEのリクエスト形式 */
	export type MoERequest = {
		feature: MoEFeatures[number] | string;
		args: string[];
		instance: string;

		/** For Toot mode */
		toot_visibility?: Mastodon.Statuses.TootPayload["visibility"];
		/** For Notify mode */
		notify_types?: string[];
		/** For Help mode */
		help_language?: string;
		help_feature?: MoERequest["feature"];
	};

	export class Utils {
		/**
		 * メールの件名からMoEリクエストに変換したものを返します
		 * @param subjectStr メール件名
		 */
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
					const { Visibility } = MoEClientToot;

					request.toot_visibility = args[0] && (!isNaN(parseInt(args[0], 10)) ? Visibility[parseInt(args[0], 10)] : args[0]) || Visibility[0];
					break;

				case ":NOTIFY":
					
					break;

				case ":HELP":
					const { defaultLanguage } = MoEClientHelp;

					request.help_language = args[0] && (MoEClientHelp.isLangRegistered(args[0]) && args[0]) || defaultLanguage;
					request.help_feature = args[1] && (MoEClientHelp.isFeatureRegistered(args[1].toUpperCase()) && args[1].toUpperCase()) || null;
					break;
			}

			return request;
		}

		/**
		 * HTML形式の文字列をパースし、生の文字列にして返します
		 * @param htmlStr HTML形式の文字列
		 */
		public static parseHtml (htmlStr: string): string {
			return htmlStr
				.replace(/(<\/p>)/g, "$1\n\n")
				.replace(/<br ?\/?>/g, "\n")
				.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "")
				.slice(0, -2);
		}
	}
}