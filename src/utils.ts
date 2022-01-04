import { log } from "./logger";

export function getEnv(envName: string, errorMessage: string): string {
  //get feature server endpoint from env variable
  let envValue = process.env[envName];
  if (!envValue) {
    throw new Error(`[ERROR] ${errorMessage}`);
  }
  envValue = envValue.trim().toLowerCase();
  log(`${envName} from env is: ${envValue}`);
  return envValue;
}

export function convertPluralNameToSingular(param: string): string {
  return param.slice(0, param.length - 1);
}
