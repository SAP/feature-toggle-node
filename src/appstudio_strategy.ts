import { Strategy as appstudioStrategy } from "unleash-client";
import { AppStudioMultiContext } from "./appstudio_context";

// The name of the str in the server
const APP_STUDIO_MULTI = "AppStudioMulti";

export interface AppStudioMultiParameters {
  environments: string; // apps
  infrastructures: string; //iaass
  landscapes: string; // regions
  subaccounts: string;
  users: string;
  wss: string;
  tenantids: string;
}

export class AppStudioMultiStrategy extends appstudioStrategy {
  constructor() {
    super(APP_STUDIO_MULTI); // for testing the name is: StrategyMulti
  }

  // Check only the strategy parameters. the default strategy is calculated at the server side
  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean {
    // Check if the user has any restrictions defined in the strategy (defined in the FT server)
    // !! returns false for: null,undefined,0,"",false
    if (!parameters.environments && !parameters.infrastructures && !parameters.landscapes && !parameters.subaccounts && !parameters.users && !parameters.wss && !parameters.tenantids) {
      // No restriction from the strategy side
      return true; // strategy returns true. if the enabled button in the FT server is "on" the feature returns enabled
    }

    // context.currentEnvironment - The Environment that the extension is running on (calculated in this client)
    // parameters.environments // The Environments that the extension is allowed to be enabled on (list is defined on the server)
    if (!!context.currentEnvironment && parameters.environments && parameters.environments.indexOf(context.currentEnvironment) !== -1) {
      //check that the environment this extension is running on is in the environments list defined in the server
      return true;
    }
    // infrastructures
    if (!!context.currentInfrastructure && parameters.infrastructures && parameters.infrastructures.indexOf(context.currentInfrastructure) !== -1) {
      return true;
    }
    // landscapes
    if (!!context.currentLandscape && parameters.landscapes && parameters.landscapes.indexOf(context.currentLandscape) !== -1) {
      return true;
    }
    // subaccounts
    if (!!context.currentCfSubAccount && parameters.subaccounts && parameters.subaccounts.indexOf(context.currentCfSubAccount) !== -1) {
      return true;
    }
    // users
    if (!!context.currentUser && parameters.users && parameters.users.indexOf(context.currentUser) !== -1) {
      return true;
    }
    // wss
    if (!!context.currentWs && parameters.wss && parameters.wss.indexOf(context.currentWs) !== -1) {
      return true;
    }
    // tenantids
    if (!!context.currentTenantId && parameters.tenantids && parameters.tenantids.indexOf(context.currentTenantId) !== -1) {
      return true;
    }

    // no matches -> send "disable the feature" to the FT server
    return false;
  }
}
