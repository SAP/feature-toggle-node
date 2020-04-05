import { isFeatureEnabled } from "../api";
import { log } from "../logger";

const EXTENSION_NAME = "sos";
const FEATURE_TOGGLE_NAME = "eom";

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// USAGE EXAMPLE - this is how the extension should use the feature-toggle-client-ts-node
(async function test(): Promise<void> {
  for (let i = 0; i < 4; i++) {
    //check default strategy
    const isEnabled: boolean = await isFeatureEnabled(EXTENSION_NAME, FEATURE_TOGGLE_NAME);
    log(`Feature ${i} enabled?: ${isEnabled}`);
    await delay(2000);
  }
})();
