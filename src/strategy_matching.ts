import { ContextData, createContextEntity } from "./current_context";
import { convertPluralNameToSingular } from "./utils";
import { Toggle } from "./api";

export interface IterateableContext extends ContextData {
  [key: string]: string;
}

enum ParametersNames {
  environments = "environments",
  infrastructures = "infrastructures",
  landscapes = "landscapes",
  subaccounts = "subaccounts",
  users = "users",
  wss = "wss",
  tenantids = "tenantids",
}

// TODO: Check infrastructure
function isMatchStrategies(toggle: Toggle): boolean {
  const currentContext: IterateableContext = createContextEntity();

  for (const parameterName of Object.values(ParametersNames)) {
    const parameterValue = toggle[parameterName];

    const singularParamName = convertPluralNameToSingular(parameterName);
    const currentContextParamValue = currentContext[singularParamName];

    if (parameterValue?.length && !parameterValue?.includes(currentContextParamValue)) {
      return false;
    }
  }
  return true;
}

export function isToggleEnabled(toggle: Toggle): boolean {
  return !toggle.disabled && toggle.strategies ? isMatchStrategies(toggle) : !toggle.disabled;
}
