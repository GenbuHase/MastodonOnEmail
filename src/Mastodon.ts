/**
 * Mastodonインスタンスとの通信を行うクラス
 */
class Mastodon {
	public token: string;

	public constructor (public instance: string) {
		this.token = UserProperties.getProperty(instance);
	}

	public get (apiUrl: string, params: Array<[ string, string ]> = []): GoogleAppsScript.URL_Fetch.HTTPResponse {
		const option: object = {
			method: "GET",
			headers: { Authorization: `Bearer ${this.token}` }
		};

		const paramStrs: Array<string> = [];
		for (const param of params) paramStrs.push(`${param[0]}=${param[1]}`);

		return UrlFetchApp.fetch(`https://${this.instance}/${apiUrl}${params.length ? `?${paramStrs.join("&")}`: ""}`, option);
	}

	post (apiUrl: string, payload: any): GoogleAppsScript.URL_Fetch.HTTPResponse {
		const option: object = {
			method: "POST",
			headers: { Authorization: `Bearer ${this.token}` }
		};

		return UrlFetchApp.fetch(`https://${this.instance}/${apiUrl}`, option);
	}
}