import * as NodeCache from "node-cache";
import { Features } from "./api";

const REFRESH_INTERVAL = 60 * 15; //15 minutes
const FEATURES_KEY = "features";
const ftCache = new NodeCache({ stdTTL: REFRESH_INTERVAL });

export class Cache {
  static getFeatureToggles(): Features | undefined {
    return ftCache.get(FEATURES_KEY);
  }

  static setFeatureToggles(toggles: Features): void {
    ftCache.set(FEATURES_KEY, toggles);
  }

  static getToggleByKey(key: string): boolean | undefined {
    return ftCache.get(key);
  }

  static setTogglesByKey(key: string, value: boolean): void {
    ftCache.set(key, value);
  }
}
