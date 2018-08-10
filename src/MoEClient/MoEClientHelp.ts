import { MoEClient } from "./MoEClient";



export class MoEClientHelp {
	/** 仕様書の言語の初期値 */
	public static readonly defaultLanguage = "en";

	/**
	 * 指定された言語が登録されているかどうかを返します
	 * @param language 仕様書の言語
	 */
	public static isLangRegistered (language: string): boolean { return MoEClientHelp.I18n[language] ? true : false; }

	/**
	 * 指定された機能が登録されているかどうかを返します
	 * @param feature 機能名
	 */
	public static isFeatureRegistered (feature: string): boolean {
		const localization: MoEClientHelp.I18nItem = MoEClientHelp.I18n[MoEClientHelp.defaultLanguage];
		return localization.details[feature] ? true : false;
	}



	public constructor (private client: MoEClient) {}

	/**
	 * 指定のアドレスにMoEの仕様書を送信します
	 * 
	 * @param to 宛先アドレス
	 * @param language 仕様書の言語
	 * @param feature 詳細情報を得たい機能名
	 */
	public send (to: string, language: string, feature?: string): void {
		const { I18n } = MoEClientHelp;

		if (feature && MoEClientHelp.isFeatureRegistered(feature)) {
			GmailApp.sendEmail(to, I18n[language].subject, I18n[language].details[feature].join("\n"));
			return;
		}

		GmailApp.sendEmail(to, I18n[language].subject, I18n[language].overview.join("\n"));
	}
}

export namespace MoEClientHelp {
	export type I18nItem = {
		subject: string;
		overview: string[];
		details: { [feature: string]: string[] };
	};

	export const I18n: { [language: string]: I18nItem } = {
		en: {
			subject: "[MoE] How to Use",
			overview: [
				"== Subject Format ==",
				"MoE{:feature?}<{:args?}>@{:instance}",
				"(ex: 'MoE@itabashi.0j0.jp')",
				"(ex: 'MoE:Toot<1>@itabashi.0j0.jp')",
				"----------",
				"{:feature} ... A name of features",
				"* Initial: ':Toot'",
				"",
				"{:args} ... Arguments of provided feature",
				"> The separator of arguments is '|'.",
				"",
				"{:instance} ... A domain of instance with your account",
				"----------",
				"",
				"",
				"== Features ==",
				"Call 'MoE:Help<{:language}|{:feature}>' if you want to see information in detail.",
				"> Do not include ':' in {:feature}. (ex: 'MoE:Help<ja|Toot>')",
				"----------",
				":Toot ... Post contents in body",
				":Notify ... Send notifications",
				":Help ... Send information",
				"----------",
				"",
				"",
				"== Magics ==",
				"You can put down them in body.",
				"----------",
				"[CW | {:CWContent}] ... Post with warning",
				"> {:CWContent} ... A warning text",
				"",
				"[{:emojiCode} | {:quantity}] ... Replaced with provided emojis",
				"> {:emojiCode} ... A code of emoji",
				"> {:quantity} ... The amount of emojis",
				"----------"
			],

			details: {
				TOOT: [
					"== Format ==",
					"MoE:Toot<{:visibility?}>",
					"(ex: 'MoE:Toot<private>')",
					"",
					"== Arguments ==",
					"{:visibility} ... An index or name of visibilities",
					"- Available: 'public', 'unlisted', 'private', 'direct', etc...",
					"* Initial: 'public'",
				],

				NOTIFY: [
					"== Format ==",
					"MoE:Notify<{: ...types}>",
					"(ex: 'MoE:Notify<follow|mention|reblog>')",
					"",
					"== Arguments ==",
					"{: ...types} ... A collection of notification types",
					"- Available: 'follow', 'favourite', 'reblog', 'mention'",
				],

				HELP: [
					"== Format ==",
					"MoE:Help<{:language?}|{:feature?}>",
					"(ex: 'MoE:Help<ja>')",
					"",
					"== Arguments ==",
					"{:language} ... The language of provided information",
					"- Available: 'ja', 'en'",
					"* Initial: 'en'",
					"",
					"{:feature} ... A name of the feature you want to see in detail",
					"> Do not include ':'. (ex: 'MoE:Help<ja|Toot>')"
				]
			}
		},

		ja: {
			subject: "[MoE] MoEの使い方",
			overview: [
				"== 件名の書式 ==",
				"MoE{:feature?}<{:args?}>@{:instance}",
				"(ex: 'MoE@itabashi.0j0.jp')",
				"(ex: 'MoE:Toot<1>@itabashi.0j0.jp')",
				"----------",
				"{:feature} ... 機能名",
				"* 既定値: ':Toot'",
				"",
				"{:args} ... 各機能の引数",
				"> 引数区切り文字 ... '|'",
				"",
				"{:instance} ... インスタンスのドメイン",
				"----------",
				"",
				"",
				"== 機能一覧 ==",
				"各機能の詳細情報は'MoE:Help<{:language}|{:feature}>'にてご確認ください。",
				"> {:feature}に':'を含めないで下さい。(ex: 'MoE:Help<ja|Toot>')",
				"----------",
				":Toot ... 本文の内容をトゥートします",
				":Notify ... 通知を確認します",
				":Help ... 仕様を確認します",
				"----------",
				"",
				"",
				"== 特殊機能 ==",
				"メール本文に記述することが出来ます。",
				"----------",
				"[CW | {:CWContent}] ... CWを付与してトゥートします",
				"> {:CWContent} ... CW内容",
				"",
				"[{:emojiCode} | {:quantity}] ... 指定された絵文字で置換します",
				"> {:emojiCode} ... 絵文字コード",
				"> {:quantity} ... 設置する数",
				"----------"
			],

			details: {
				TOOT: [
					"== 書式 ==",
					"MoE:Toot<{:visibility?}>",
					"(ex: 'MoE:Toot<private>')",
					"",
					"== 引数 ==",
					"{:visibility} ... 公開範囲",
					"- 規定値: 'public', 'unlisted', 'private', 'direct', etc...",
					"* 既定値: 'public'",
				],

				NOTIFY: [
					"== 書式 ==",
					"MoE:Notify<{: ...types}>",
					"(ex: 'MoE:Notify<follow|mention|reblog>')",
					"",
					"== 引数 ==",
					"{: ...types} ... 通知タイプの配列",
					"- 規定値: 'follow', 'favourite', 'reblog', 'mention'",
				],

				HELP: [
					"== 書式 ==",
					"MoE:Help<{:language?}|{:feature?}>",
					"(ex: 'MoE:Help<ja>')",
					"",
					"== 引数 ==",
					"{:language} ... 仕様書の言語",
					"- 規定値: 'ja', 'en'",
					"* 既定値: 'en'",
					"",
					"{:feature} ... 詳細情報を確認したい機能名",
					"> ':' を含めないでください。(ex: 'MoE:Help<ja|Toot>')"
				]
			}
		}
	};
}