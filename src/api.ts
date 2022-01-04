import { log } from "./logger";
import { requestFeatureToggles } from "./request";

import { isToggleEnabled } from "./strategy_matching";
import { Cache } from "./cache";

export interface Parameters {
  environments: string[]; // apps
  infrastructures: string[]; //iaass
  landscapes: string[]; // regions
  subaccounts: string[];
  users: string[];
  wss: string[];
  tenantids: string[];
}

export interface Features {
  features: Toggle[];
}

export interface Toggle extends Parameters {
  name: string;
  description: string;
  disabled: boolean;
  strategies: boolean;
}

function validateFeatureToggleName(extensionName: string, toggleName: string): void {
  if (!extensionName || !toggleName) {
    const errStr = !extensionName ? "extension " : "";
    throw new Error(`Feature toggle ${errStr}name can not be empty, null or undefined`);
  }
}

async function getFeatureToggles(): Promise<Features> {
  let toggles: Features = Cache.getFeatureToggles() as Features;

  if (!toggles) {
    toggles = await requestFeatureToggles();
  }
  return toggles;
}

function findToggleByName(toggles: Features, ftName: string): Toggle | undefined {
  return toggles.features.find((toggle) => toggle.name == ftName);
}

export async function isFeatureEnabled(extensionName: string, toggleName: string): Promise<boolean> {
  log(`Checking if Extension Name: "${extensionName}", Feature Toggle Name: "${toggleName}" is enabled`);

  const ftName = `${extensionName}.${toggleName}`;

  try {
    validateFeatureToggleName(extensionName, toggleName);
    const toggleFromCache = Cache.getToggleByKey(ftName);

    if (toggleFromCache != undefined) {
      return toggleFromCache;
    }

    const toggles: Features = await getFeatureToggles();
    if (toggles.features.length) {
      Cache.setFeatureToggles(toggles);

      const toggle: Toggle | undefined = findToggleByName(toggles, ftName);

      if (toggle) {
        const isEnabled = isToggleEnabled(toggle);
        Cache.setTogglesByKey(toggle.name, isEnabled);
        return isEnabled;
      }
    }

    return false;
  } catch (err) {
    const logErr = `[ERROR] Failed to determine if feature toggle ${ftName} is enabled. Returning feature DISABLED. Error message: ${err}`;
    log(logErr);
    return false;
  }
}
