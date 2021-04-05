import { AppStudioMultiContext } from "../appstudio_context";
import { AppStudioMultiParameters, AppStudioMultiStrategy } from "./appStudioMultiStrategy";
import { EnvironmentsStrategy, InfrastructuresStrategy, LandscapesStrategy, SubAccountsStrategy, TenantIdsStrategy, UsersStrategy, WssStrategy } from "./strategies";

export interface AppStudioStrategy {
  getName(): string;

  // Check if the user has any restrictions defined in the strategy (defined in the FT server)
  isDefined(parameters: AppStudioMultiParameters): boolean;

  // context.currentEnvironment - The Environment that the extension is running on (calculated in this client)
  // parameters.environments // The Environments that the extension is allowed to be enabled on (list is defined on the server)
  isEnabled(parameters: AppStudioMultiParameters, context: AppStudioMultiContext): boolean;
}

export function registerStrategies(appStudioMultiStrategy: AppStudioMultiStrategy): void {
  appStudioMultiStrategy.register([new EnvironmentsStrategy(), new InfrastructuresStrategy(), new LandscapesStrategy(), new SubAccountsStrategy(), new UsersStrategy(), new WssStrategy(), new TenantIdsStrategy()]);
}
