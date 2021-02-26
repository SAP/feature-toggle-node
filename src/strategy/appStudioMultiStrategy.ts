import { Strategy } from "unleash-client";
import { AppStudioMultiContext } from "../appstudio_context";
import { log } from "../logger";
import { AppStudioStrategy } from "./appStudioStrategies";

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

export class AppStudioMultiStrategy extends Strategy {
  private strategies: AppStudioStrategy[] = [];

  constructor() {
    super(APP_STUDIO_MULTI); // for testing the name is: StrategyMulti
  }

  public register(appStudioStrategies: AppStudioStrategy[]): void {
    appStudioStrategies.forEach((appStudioStrategy) => {
      const strategyName = appStudioStrategy.getName();
      const isExist = this.strategies.some((strategy) => strategy.getName() === strategyName);
      if (isExist) {
        throw new Error(`Strategy ${strategyName} already registered`);
      }

      log(`Added strategy: ${strategyName}`);
      this.strategies.push(appStudioStrategy);
    });
  }

  // Check only the strategy parameters. the default strategy is calculated at the server side
  /** Template method */
  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean {
    // Check if the user has any restrictions defined in the strategy (defined in the FT server)
    const isNotDefined = this.strategies.every((strategy) => !strategy.isDefined(parameters));
    if (isNotDefined) {
      // No restriction from the strategy side
      return true;
    }

    // context.currentEnvironment - The Environment that the extension is running on (calculated in this client)
    // parameters.environments // The Environments that the extension is allowed to be enabled on (list is defined on the server)
    // Check if strategy meet one of the terms
    const isStrategyMet = this.strategies.some((strategy) => strategy.isEnabled(parameters, context));
    if (isStrategyMet) {
      return true;
    }

    // no matches -> send "disable the feature" to the FT server
    return false;
  }
}
