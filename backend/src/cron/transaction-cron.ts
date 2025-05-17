import { CronJob } from "cron";

// TODO: Nanti update biar ga ngecek tiap menit
export const transactionCron = new CronJob("* * * * *", async () => {
  const date = new Date();
  console.log("Transaction cron job running at", date.toISOString());
});
