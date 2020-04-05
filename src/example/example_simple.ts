import { isFeatureEnabled } from "../api";

const EXTENSION_NAME = "sos";
const FEATURE_TOGGLE_NAME = "eom";

// USAGE EXAMPLE - this is how the extension should use the feature-toggle-client-ts-node
(async function test(): Promise<void> {
  //check default strategy
  if (await isFeatureEnabled(EXTENSION_NAME, FEATURE_TOGGLE_NAME)) {
    console.log(`Feature is Enabled`);
  } else {
    console.log(`Feature is NOT Enabled`);
  }
})();
