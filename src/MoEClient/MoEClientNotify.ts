import { Mastodon } from "../Mastodon";
import { MoEClient } from "./MoEClient";



export class MoEClientNotify {
	public static readonly NotificationTypes: Mastodon.Notifications.NotificationTypes = ["follow", "favourite", "reblog", "mention"];



	public constructor (private client: MoEClient) {}

	/**
	 * 通知を取得して返します
	 * @param types 取得したい通知の種類
	 */
	private getNotifications (types: Mastodon.Notifications.NotificationTypes[number][] = ["mention"]): Mastodon.Notifications.Notification[] {
		let excludeTypes: Mastodon.Notifications.NotificationTypes[number][] = MoEClientNotify.NotificationTypes;
		types.forEach(type => excludeTypes = excludeTypes.filter(included => included !== type));

		const params: Mastodon.Notifications.GetListParams = {
			"exclude_types[]": excludeTypes
		};

		return JSON.parse(this.client.get("api/v1/notifications", params).getContentText());
	}

	/**
	 * 指定のアドレスに通知情報を送信します
	 * @param to 宛先アドレス
	 */
	public send (to: string): void {
		const messages: string[] = [];

		const notifications: Mastodon.Notifications.Notification[] = this.getNotifications();
		notifications.forEach(mention => {
			messages.push([
				`<${new Date(mention.created_at).toLocaleString()}> ${mention.account.acct}`,
				MoEClient.Utils.parseHtml(mention.status.content)
			].join("\n"));
		});

		GmailApp.sendEmail(to, `[MoE] ${this.client.instance}の通知情報`, messages.join("\n"));
	}
}

export namespace MoEClientNotify {}