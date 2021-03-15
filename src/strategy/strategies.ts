import { AppStudioMultiContext } from "../appstudio_context";
import { AppStudioStrategy } from "./appStudioStrategies";
import { AppStudioMultiParameters } from "./appStudioMultiStrategy";

export class EnvironmentsStrategy extends AppStudioStrategy {
  getName(): string {
    return `Environments_Strategy`;
  }

  isDefined(parameters: AppStudioMultiParameters): boolean {
    return !!parameters.environments;
  }

  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean {
    if (!!context.currentEnvironment && parameters.environments && parameters.environments.indexOf(context.currentEnvironment) !== -1) {
      return true;
    }
    return false;
  }
}

export class InfrastructuresStrategy extends AppStudioStrategy {
  getName(): string {
    return `Infrastructures_Strategy`;
  }

  isDefined(parameters: AppStudioMultiParameters): boolean {
    return !!parameters.infrastructures;
  }

  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean {
    if (!!context.currentInfrastructure && parameters.infrastructures && parameters.infrastructures.indexOf(context.currentInfrastructure) !== -1) {
      return true;
    }
    return false;
  }
}

export class LandscapesStrategy extends AppStudioStrategy {
  getName(): string {
    return `Landscapes_Strategy`;
  }

  isDefined(parameters: AppStudioMultiParameters): boolean {
    return !!parameters.landscapes;
  }

  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean {
    if (!!context.currentLandscape && parameters.landscapes && parameters.landscapes.indexOf(context.currentLandscape) !== -1) {
      return true;
    }
    return false;
  }
}

export class SubAccountsStrategy extends AppStudioStrategy {
  getName(): string {
    return `SubAccounts_Strategy`;
  }

  isDefined(parameters: AppStudioMultiParameters): boolean {
    return !!parameters.subaccounts;
  }

  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean {
    if (!!context.currentCfSubAccount && parameters.subaccounts && parameters.subaccounts.indexOf(context.currentCfSubAccount) !== -1) {
      return true;
    }
    return false;
  }
}

export class UsersStrategy extends AppStudioStrategy {
  getName(): string {
    return `Users_Strategy`;
  }

  isDefined(parameters: AppStudioMultiParameters): boolean {
    return !!parameters.users;
  }

  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean {
    if (!!context.currentUser && parameters.users && parameters.users.indexOf(context.currentUser) !== -1) {
      return true;
    }
    return false;
  }
}

export class WssStrategy extends AppStudioStrategy {
  getName(): string {
    return `Wss_Strategy`;
  }

  isDefined(parameters: AppStudioMultiParameters): boolean {
    return !!parameters.wss;
  }

  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean {
    if (!!context.currentWs && parameters.wss && parameters.wss.indexOf(context.currentWs) !== -1) {
      return true;
    }
    return false;
  }
}

export class TenantIdsStrategy extends AppStudioStrategy {
  getName(): string {
    return `TenantIds_Strategy`;
  }

  isDefined(parameters: AppStudioMultiParameters): boolean {
    return !!parameters.tenantids;
  }

  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean {
    if (!!context.currentTenantId && parameters.tenantids && parameters.tenantids.indexOf(context.currentTenantId) !== -1) {
      return true;
    }
    return false;
  }
}
