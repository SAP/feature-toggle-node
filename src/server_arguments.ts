import { log } from "./logger";
import { getEnv } from "./utils";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parse = require("parse-duration");

export const ENV_FT_SERVER_ENDPOINT_NAME = "FT_SERVER_ENDPOINT";
export const ENV_REFRESH_INTERVAL_NAME = "FT_CLIENT_REFRESH_INTERVAL";
const DEFAULT_REFRESH_INTERVAL = "10s"; //10 sec

export interface ServerArgs {
  ftServerEndPoint: string;
  ftServerInterval: number;
}

// get featureToggle server url and client refresh interval from environment variables
export function getServerArgs(): ServerArgs {
  //get feature server endpoint from env variable
  let endpoint = getEnv(ENV_FT_SERVER_ENDPOINT_NAME, "Feature toggle server endpoint (FT_SERVER_ENDPOINT) was NOT found in the environment variables.");
  // add /api/ to url. handles url with trailing slash and without
  endpoint = endpoint.replace(/\/?$/, "/api/");

  //get refresh interval
  let interval = process.env[ENV_REFRESH_INTERVAL_NAME];
  if (!interval) {
    interval = parse(DEFAULT_REFRESH_INTERVAL);
    log(`client refresh interval not set, using the default interval: ${DEFAULT_REFRESH_INTERVAL}`);
  } else {
    interval = parse(interval);
  }
  log(`client refresh interval is: ${interval}`);
  return { ftServerEndPoint: endpoint, ftServerInterval: Number(interval) };
}
