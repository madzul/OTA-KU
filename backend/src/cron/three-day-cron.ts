import { CronJob } from "cron";

// Runs daily at midnight
export const everyThreeDaysCron = new CronJob(
  "0 0 * * *",
  async () => {
    const today = new Date();
    const startDate = new Date("2025-01-01");
    const diffInDays = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays % 3 === 0) {
      console.log("3-day interval cron job running at", today.toISOString());
    }
  },
  null,
  true,
  "Asia/Jakarta",
);
