import { Mastodon, MoEClient } from "./Mastodon";



function run (): void {
	const threads: GoogleAppsScript.Gmail.GmailThread[] = GmailApp.search(`-in:(trash) is:(unread) subject:(${MoEClient.SubjectMatcher})`);
}