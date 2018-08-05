export class Scheduler {
	/** Work Per Minutes */
	private static readonly WPM: number = 2;
	private static readonly MAINMETHOD: string = "main";

	public static scheduleInit (): void {
		const { WPM } = Scheduler;

		const scheduledBaseAt: Date = new Date();
		scheduledBaseAt.setMinutes(scheduledBaseAt.getMinutes() + 1);
		scheduledBaseAt.setSeconds(0);

		for (let i: number = 0; i < WPM; i++) {
			const scheduledAt: Date = new Date(scheduledBaseAt);
			scheduledAt.setSeconds((60 / WPM) * i);

			ScriptApp.newTrigger("_schedule").timeBased().at(scheduledAt).create();

			if (i === WPM - 1) {
				const clearScheduledAt: Date = new Date(scheduledAt);
				clearScheduledAt.setMinutes(clearScheduledAt.getMinutes() + 1);

				ScriptApp.newTrigger("_scheduleClear").timeBased().at(clearScheduledAt).create();
			}
		}
	}

	public static scheduleEnd (): void {
		const triggers: GoogleAppsScript.Script.Trigger[] = ScriptApp.getProjectTriggers();
		triggers.forEach(trigger => {
			if (trigger.getHandlerFunction() === Scheduler.MAINMETHOD) ScriptApp.deleteTrigger(trigger);
		});
	}

	public static _schedule (): void { ScriptApp.newTrigger(Scheduler.MAINMETHOD).timeBased().everyMinutes(1).create(); }

	public static _scheduleClear (): void {
		const triggers: GoogleAppsScript.Script.Trigger[] = ScriptApp.getProjectTriggers();
		triggers.forEach(trigger => {
			switch (trigger.getHandlerFunction()) {
				case "_schedule":
				case "_scheduleClear":
					ScriptApp.deleteTrigger(trigger);
					break;
			}
		});
	}
}



function _schedule (): void { Scheduler._schedule(); }
function _scheduleClear (): void { Scheduler._scheduleClear(); }