export class Scheduler {
	/** Work Per Minutes */
	private static readonly WPM: number = 2;

	public scheduleInit (): void {
		const { WPM } = Scheduler;

		const scheduleAt: Date = new Date();
		scheduleAt.setMinutes(scheduleAt.getMinutes() + 1);

		for (let i: number = 0; i < WPM; i++) {
			scheduleAt.setSeconds(60 / WPM * i);
			ScriptApp.newTrigger("_schedule").timeBased().at(scheduleAt).create();

			if (i < WPM - 1) return;

			const clearAt: Date = scheduleAt;
			clearAt.setSeconds(clearAt.getSeconds() + 20);

			ScriptApp.newTrigger("_scheduleClear").timeBased().at(clearAt).create();
		}
	}

	public scheduleEnd (): void {
		const triggers: Array<GoogleAppsScript.Script.Trigger> = ScriptApp.getProjectTriggers();
		for (const trigger of triggers) {
			if (trigger.getHandlerFunction() === "run") ScriptApp.deleteTrigger(trigger);
		}
	}
}



function launch (): void { return new Scheduler().scheduleInit(); }
function dismiss (): void { return new Scheduler().scheduleEnd(); }