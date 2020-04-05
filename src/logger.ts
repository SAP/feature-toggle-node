export const SHOW_LOG_ENV = "SHOW_LOG";

export function log(logMessage: string): void {
  const showLog = process.env[SHOW_LOG_ENV];
  if (showLog) {
    console.log(`[Feature Toggle] ${logMessage}`);
  }
}
