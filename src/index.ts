import { Mastodon, MoEClient } from "./Mastodon";



function run (): void {
	const threads: GoogleAppsScript.Gmail.GmailThread[] = GmailApp.search(`-in:(trash) is:(unread) subject:(${MoEClient.SubjectMatcher})`);
	threads.forEach(thread => {
		const subject: RegExpMatchArray = thread.getFirstMessageSubject().match(MoEClient.SubjectMatcher);
		if (!subject) return;

		const mode: string = (subject[1] || "").toUpperCase();
		const instance: string = subject[2] || "";
		const visilibity: string = subject[3] ? (typeof subject[3] === "number" ? Mastodon.TootVisibility[subject[3]] : subject[3]) : "public";

		const client: MoEClient = new MoEClient(instance);

		const mailsWithThread: GoogleAppsScript.Gmail.GmailMessage[] = thread.getMessages();
		mailsWithThread.forEach(mail => {
			if (!mail.isUnread()) return;

			const from: string = mail.getFrom();

			switch (mode) {
				default:
				case ":TOOT":
					client.toot(mail.getPlainBody(), visilibity);
					break;

				case ":NOTIFY":
					break;
			}

			mail.markRead();
			mail.moveToTrash();
		});
	});
}