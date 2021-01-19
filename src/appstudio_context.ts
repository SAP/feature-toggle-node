import { parse } from "url";
import { Context as appstudioContext } from "unleash-client/lib/context";
import { getEnv } from "./utils";

const USER_NAME = "USER_NAME";
const WS_BASE_URL = "WS_BASE_URL";
const LANDSCAPE_ENVIRONMENT = "LANDSCAPE_ENVIRONMENT";
const LANDSCAPE_NAME = "LANDSCAPE_NAME";
const TENANT_ID = "TENANT_ID";
const SUB_ACCOUNT = "TENANT_NAME";

const fullFormatWsBaseUrl = "Expected format: https://workspaces-ws-<id>.<cluster region>.<domain>/";

export interface AppStudioMultiContext extends appstudioContext {
  currentEnvironment: string; //app
  currentInfrastructure: string; //iaas
  currentLandscape: string; //region
  currentCfSubAccount: string;
  currentUser: string;
  currentWs: string;
  currentTenantId: string;
}

function extractWs(wsBaseUrl: string): string {
  // Example:
  // https://workspaces-ws-9gzgq.eu10.trial.applicationstudio.cloud.sap/

  const regex = new RegExp("^(https:)\\S*(workspaces-ws-)\\S*", "g");
  if (!regex.test(wsBaseUrl)) {
    throw new Error(`Feature toggle env WS_BASE_URL is NOT in the correct format. ${fullFormatWsBaseUrl}`);
  }

  // strip the "https"
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const wsBaseUrlNormalize = parse(wsBaseUrl).host!; // ! because it is tested in the regex

  // remove "workspaces-" to get: "ws-9gzgq.eu10.trial.applicationstudio.cloud.sap/""
  const wsBaseUrlWorkspaces = wsBaseUrlNormalize.replace("workspaces-", "");

  // convert ws-9gzgq.eu10.trial.applicationstudio.cloud.sap/ to [ws-9gzgq, eu10,trial, ...]
  const splitByDotArray = wsBaseUrlWorkspaces.split(".");

  const currentWs = splitByDotArray[0]; // workspace: "ws-9gzgq"
  return currentWs;
}

export function createContextObject(): AppStudioMultiContext {
  // get the user name from the env
  const userName = getEnv(USER_NAME, `Feature toggle env ${USER_NAME} was NOT found in the environment variables`);
  // get the environment from the env
  const environment = getEnv(LANDSCAPE_ENVIRONMENT, `Feature toggle env ${LANDSCAPE_ENVIRONMENT} was NOT found in the environment variables`);
  // get the landscape from the env
  const landscape = getEnv(LANDSCAPE_NAME, `Feature toggle env ${LANDSCAPE_NAME} was NOT found in the environment variables`);
  // get the tenant id from the env
  const tenantId = getEnv(TENANT_ID, `Feature toggle env ${TENANT_ID} was NOT found in the environment variables`);
  // get the tenant id from the env
  const subAccount = getEnv(SUB_ACCOUNT, `Feature toggle env ${SUB_ACCOUNT} was NOT found in the environment variables`);
  // get WS_BASE_URL env
  const wsBaseUrlString = getEnv(WS_BASE_URL, "Feature toggle env WS_BASE_URL was NOT found in the environment variables");

  // Extract the WS and cluster and save  in the context
  const ws = extractWs(wsBaseUrlString);

  // Create the context
  const context: AppStudioMultiContext = {
    currentEnvironment: environment,
    currentInfrastructure: "",
    currentLandscape: landscape,
    currentCfSubAccount: subAccount,
    currentUser: userName,
    currentWs: ws,
    currentTenantId: tenantId,
  };

  return context;
}
