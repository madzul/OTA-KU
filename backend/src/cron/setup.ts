import { dailyReminder7DaysCron, dailyReminderCron } from "./daily-cron.js";
import { monthlyCron } from "./monthly-cron.js";
import { everyThreeDaysCron } from "./three-day-cron.js";

export function setupCronJobs() {
  // TODO: Nanti cuma start cron di environment production
  dailyReminderCron.start();
  dailyReminder7DaysCron.start();
  everyThreeDaysCron.start();
  monthlyCron.start();
}
