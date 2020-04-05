import { Strategy as appstudioStrategy } from "unleash-client";
import { AppStudioMultiContext } from "./appstudio_context";

// The name of the str in the server
const APP_STUDIO_MULTI = "AppStudioMulti";

export interface AppStudioMultiParameters {
  apps: string;
  iaass: string;
  regions: string;
  subaccounts: string;
  users: string;
  wss: string;
}

export class AppStudioMultiStrategy extends appstudioStrategy {
  constructor() {
    super(APP_STUDIO_MULTI); // for testing the name is: StrategyMulti
  }

  // Check only the strategy parameters. the default strategy is calculated at the server side
  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean {
    // Check if the user has any restrictions defined in the strategy (defined in the FT server)
    // !! returns false for: null,undefined,0,"",false
    if (!parameters.apps && !parameters.iaass && !parameters.regions && !parameters.subaccounts && !parameters.users && !parameters.wss) {
      // No restriction from the strategy side
      return true; // strategy returns true. if the enabled button in the FT server is "on" the feature returns enabled
    }

    // context.currentApp - The app that the extension is running on (calculated in this client)
    // parameters.apps // The apps that the extension is allowed to be enabled on (list is defined on the server)
    if (!!context.currentApp && parameters.apps && parameters.apps.indexOf(context.currentApp) !== -1) {
      //check that the app this extension is running on is in the apps list defined in the server
      return true;
    }
    // iaass
    if (!!context.currentIaas && parameters.iaass && parameters.iaass.indexOf(context.currentIaas) !== -1) {
      return true;
    }
    // regions
    if (!!context.currentRegion && parameters.regions && parameters.regions.indexOf(context.currentRegion) !== -1) {
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

    // no matches -> send "disable the feature" to the FT server
    return false;
  }
}
