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
			const tootContent: string = MoEClient.Utils.parseHtml(notification.status && notification.status.content || "");
			
			const messageHeader: string = `<${createdAt}> ${notifier}`;
			let message: string[] = [];

			switch (notification.type) {
				default:
					message.push(
						messageHeader,
						tootContent
					);
					break;
					
				case "favourite":
					message.push(
						`${messageHeader} liked your post`,
						tootContent
					);
					break;

				case "follow":
					message.push(
						`${messageHeader} has followed you`
					);
					break;

				case "mention":
					message.push(
						`${messageHeader} mentioned you`,
						tootContent
					);
					break;

				case "reblog":
					message.push(
						`${messageHeader} reblogged your post`,
						tootContent
					);
					break;
			}

			messages.push(message.join("\n"));
		});

		GmailApp.sendEmail(to, `[MoE] ${this.client.instance}の通知情報`, messages.join("\n\n"));
	}
}

export namespace MoEClientNotify {}