import { log } from "./logger";
import { getEnv } from "./utils";

export const ENV_FT_SERVER_ENDPOINT_NAME = "FT_SERVER_ENDPOINT";
export const ENV_FT_TOKEN = "FT_TOKEN";
const REFRESH_INTERVAL = 60000 * 30; //30 minutes

export interface ServerArgs {
  ftServerEndPoint: string;
  ftServerInterval: number;
  ftServerToken: string | undefined;
}

// get featureToggle server url from environment variables
export function getServerArgs(): ServerArgs {
  let endpoint = getEnv(ENV_FT_SERVER_ENDPOINT_NAME, "Feature toggle server endpoint (FT_SERVER_ENDPOINT) was NOT found in the environment variables.");
  // add /api/ to url. handles url with trailing slash and without
  endpoint = endpoint.replace(/\/?$/, "/api/");
  log(`client refresh interval is: ${REFRESH_INTERVAL}`);

  return { ftServerEndPoint: endpoint, ftServerInterval: REFRESH_INTERVAL, ftServerToken: process.env[ENV_FT_TOKEN] };
}
