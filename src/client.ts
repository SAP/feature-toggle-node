import * as Cache from "./cache";
import { requestFeatureToggles } from "./request";
import { isToggleEnabled } from "./strategies";

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

const REFRESH_INTERVAL = 60 * 15; //15 minutes
let timeIntervalId: NodeJS.Timeout;

// for test purpose only
export function clearCacheRefreshInterval() {
  clearInterval(timeIntervalId);
}

function refreshCacheByInterval(): void {
  timeIntervalId = setInterval(async () => {
    const toggles = await requestFeatureToggles();

    if (toggles?.features !== undefined) {
      Cache.flushCache();
      Cache.setFeatureToggles(toggles);
    }
  }, REFRESH_INTERVAL);
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

export async function findToggleAndReturnState(ftName: string): Promise<boolean> {
  if (!timeIntervalId) {
    refreshCacheByInterval();
  }

  const toggleFromCache = Cache.getToggleByKey(ftName);

  if (toggleFromCache != undefined) {
    return toggleFromCache;
  }

  const toggles: Features = await getFeatureToggles();
  if (toggles.features.length) {
    const toggle: Toggle | undefined = findToggleByName(toggles, ftName);

    if (toggle) {
      const isEnabled = isToggleEnabled(toggle);
      Cache.setTogglesByKey(toggle.name, isEnabled);
      return isEnabled;
    }
  }

  return false;
}
