import { transactionCron } from "./transaction-cron.js";

export function setupCronJobs() {
  // TODO: Nanti cuma start cron di environment production
  transactionCron.start();
}
