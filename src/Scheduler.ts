export class Scheduler {
	/** Work Per Minutes */
	private static readonly WPM: number = 2;

	public static scheduleInit (): void {
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

	public static scheduleEnd (): void {
		const triggers: Array<GoogleAppsScript.Script.Trigger> = ScriptApp.getProjectTriggers();
		for (const trigger of triggers) {
			if (trigger.getHandlerFunction() === "run") ScriptApp.deleteTrigger(trigger);
		}
	}

	public static _schedule (): void { ScriptApp.newTrigger("run").timeBased().everyMinutes(1).create(); }

	public static _scheduleClear (): void {
		const triggers: Array<GoogleAppsScript.Script.Trigger> = ScriptApp.getProjectTriggers();
		for (const trigger of triggers) {
			switch (trigger.getHandlerFunction()) {
				case "_schedule":
				case "_scheduleClear":
					ScriptApp.deleteTrigger(trigger);
					break;
			}
		}
	}
}



function launch (): void { Scheduler.scheduleInit(); }
function dismiss (): void { Scheduler.scheduleEnd(); }

function _schedule (): void { Scheduler._schedule(); }
function _scheduleClear (): void { Scheduler._scheduleClear(); }