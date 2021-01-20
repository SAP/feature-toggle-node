import { Context as appstudioContext } from "unleash-client/lib/context";
import { getEnv } from "./utils";

const USER_NAME = "USER_NAME";
const LANDSCAPE_ENVIRONMENT = "LANDSCAPE_ENVIRONMENT";
const LANDSCAPE_NAME = "LANDSCAPE_NAME";
const TENANT_ID = "TENANT_ID";
const SUB_ACCOUNT = "TENANT_NAME";
const WORKSPACE_ID = "WORKSPACE_ID";

export interface AppStudioMultiContext extends appstudioContext {
  currentEnvironment: string; //app
  currentInfrastructure: string; //iaas
  currentLandscape: string; //region
  currentCfSubAccount: string;
  currentUser: string;
  currentWs: string;
  currentTenantId: string;
}

function getEnvWithNotFoundError(envVar: string): string {
  return getEnv(envVar, `Feature toggle env ${envVar} was NOT found in the environment variables`);
}

export function createContextObject(): AppStudioMultiContext {
  // get the user name from the env
  const userName = getEnvWithNotFoundError(USER_NAME);
  // get the environment from the env
  const environment = getEnvWithNotFoundError(LANDSCAPE_ENVIRONMENT);
  // get the landscape from the env
  const landscape = getEnvWithNotFoundError(LANDSCAPE_NAME);
  // get the tenant id from the env
  const tenantId = getEnvWithNotFoundError(TENANT_ID);
  // get the tenant id from the env
  const subAccount = getEnvWithNotFoundError(SUB_ACCOUNT);
  // get WORKSPACE_ID env
  const ws = getEnvWithNotFoundError(WORKSPACE_ID);

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
