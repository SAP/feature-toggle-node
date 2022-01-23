import * as Cache from "./cache";
import { requestFeatureToggles } from "./request";
import { isToggleEnabled } from "./strategies";
import { log } from "./logger";

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

let REFRESH_INTERVAL = 60 * 1000 * 15; // 15 minutes
let timeIntervalId: NodeJS.Timeout;

// tests purpose
export function updateRefreshInterval(interval: number): void {
  REFRESH_INTERVAL = interval;
}

export async function requestTogglesAndSaveNewCache(): Promise<void> {
  const toggles = await requestFeatureToggles();
  if (toggles?.features?.length) {
    Cache.flushCache();
    Cache.setFeatureToggles(toggles);
    log("Feature toggle cache updated");
  }
}

export function refreshCacheByInterval(): void {
  timeIntervalId = setInterval(async () => {
    await requestTogglesAndSaveNewCache();
  }, REFRESH_INTERVAL);
}

async function getFeatureToggles(): Promise<Features> {
  let toggles: Features | undefined = Cache.getFeatureToggles();

  if (!toggles) {
    toggles = await requestFeatureToggles();
    Cache.setFeatureToggles(toggles);
  }
  return toggles;
}

function findToggleByName(toggles: Features, ftName: string): Toggle | undefined {
  return toggles.features.find((toggle) => toggle.name == ftName);
}

/*
 * Starts cache refresh by interval
 * Returns boolean value from cache by toggle name
 * if toggle name not present function takes all toggles from cache
 * and calculate specific toggle
 * in case cache with toggles empty
 * makes request to server, update cache and calculate toggle value
 * */
export async function findToggleAndReturnState(ftName: string): Promise<boolean> {
  if (!timeIntervalId) {
    refreshCacheByInterval();
  }

  const toggleFromCache = Cache.getToggleByKey(ftName);

  if (toggleFromCache != undefined) {
    return toggleFromCache;
  }

  const toggles: Features = await getFeatureToggles();

  if (toggles?.features?.length) {
    const toggle: Toggle | undefined = findToggleByName(toggles, ftName);

    if (toggle) {
      const isEnabled = isToggleEnabled(toggle);
      Cache.setTogglesByKey(toggle.name, isEnabled);
      return isEnabled;
    }
  }

  return false;
}
