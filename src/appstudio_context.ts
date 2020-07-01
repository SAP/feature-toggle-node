import { Context as appstudioContext } from "unleash-client/lib/context";
import { getEnv } from "./utils";

const USER_NAME = "USER_NAME";
const WS_BASE_URL = "WS_BASE_URL";
const LANDSCAPE_ENVIRONMENT = "LANDSCAPE_ENVIRONMENT";
const LANDSCAPE_NAME = "LANDSCAPE_NAME";

const fullFormatWsBaseUrl = "Expected format: https://<CF sub account>-workspaces-ws-<id>.<cluster region>.<domain>/";

export interface AppStudioMultiContext extends appstudioContext {
  currentEnvironment: string; //app
  currentInfrastructure: string; //iaas
  currentLandscape: string; //region
  currentCfSubAccount: string;
  currentUser: string;
  currentWs: string;
}

function extractCfSubAccountAndWs(wsBaseUrlString: string, context: AppStudioMultiContext): void {
  // Example - sub account with hyphen
  // https://consumer-trial-workspaces-ws-9gzgq.eu10.trial.applicationstudio.cloud.sap/
  // consumer-trial: the cf sub account
  // ws-9gzgq: the WS

  const regex = new RegExp("^(https:)\\S*(-workspaces-ws-)\\S*", "g");
  if (!regex.test(wsBaseUrlString)) {
    throw new Error(`Feature toggle env WS_BASE_URL is NOT in the correct format. ${fullFormatWsBaseUrl}`);
  }

  // make wsBaseUrlString: [consumer-trial, ws-9gzgq.eu10.trial.applicationstudio.cloud.sap/]
  const splitByWorkspaces = wsBaseUrlString.substr(8).split("-workspaces-");
  context.currentCfSubAccount = splitByWorkspaces[0]; // sub account: "consumer-trial"

  // turn ws-9gzgq.eu10.trial.applicationstudio.cloud.sap/ to [ws-9gzgq, eu10,trial, ...]
  const splitDotArray = splitByWorkspaces[1].split(".");

  context.currentWs = splitDotArray[0]; // workspace: ws-n8vmz
}

export function createContextObject(): AppStudioMultiContext {
  // get the user name from the env
  const userName = getEnv(USER_NAME, "Feature toggle env USER_NAME was NOT found in the environment variables");
  // get the environment from the env
  const environment = getEnv(LANDSCAPE_ENVIRONMENT, "Feature toggle env LANDSCAPE_ENVIRONMENT was NOT found in the environment variables");
  // get the landscape from the env
  const landscape = getEnv(LANDSCAPE_NAME, "Feature toggle env LANDSCAPE_NAME was NOT found in the environment variables");

  // Create the context
  const context: AppStudioMultiContext = {
    currentEnvironment: environment,
    currentInfrastructure: "",
    currentLandscape: landscape,
    currentCfSubAccount: "", // will be added in the next function
    currentUser: userName,
    currentWs: "", // will be added in the next function
  };

  // get the WS and SubAccount from WS_BASE_URL env
  const wsBaseUrlString = getEnv(WS_BASE_URL, "Feature toggle env WS_BASE_URL was NOT found in the environment variables");
  // Extract the WS and cluster and save  in the context
  extractCfSubAccountAndWs(wsBaseUrlString, context);

  return context;
}
