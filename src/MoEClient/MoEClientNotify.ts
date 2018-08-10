import { Mastodon } from "../Mastodon";
import { MoEClient } from "./MoEClient";



export class MoEClientNotify {
	public static readonly Types: Mastodon.Notifications.NotificationType = ["follow", "favourite", "reblog", "mention"];



	public constructor (private client: MoEClient) {}

	/**
	 * 通知を取得して返します
	 * @param types 取得したい通知の種類
	 */
	private getNotifications (types: Mastodon.Notifications.GetListParams["exclude_types[]"] = ["mention"]): Mastodon.Notifications.Notification[] {
		let excludeTypes: Mastodon.Notifications.GetListParams["exclude_types[]"] = MoEClientNotify.Types;
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
	public send (to: string, types: Mastodon.Notifications.GetListParams["exclude_types[]"]): void {
		const messages: string[] = [];

		const notifications: Mastodon.Notifications.Notification[] = this.getNotifications(types);
		notifications.forEach(notification => {
			const createdAt: String = new Date(notification.created_at).toLocaleString();
			const notifier: String = notification.account.acct;

			switch (notification.type) {
				default:
					return messages.push([
						`<${createdAt}> ${notifier}`,
						MoEClient.Utils.parseHtml(notification.status.content)
					].join("\n"));

				case "follow":
					return messages.push([
						`<${createdAt}> ${notifier}`,
						`${notifier} has followed you`
					].join("\n"));
			}
		});

		GmailApp.sendEmail(to, `[MoE] ${this.client.instance}の通知情報`, messages.join("\n"));
	}
}

export namespace MoEClientNotify {}