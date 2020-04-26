import { Context } from "unleash-client/lib/context";
import * as clientManager from "./unleash_client_manager";
import * as contextManager from "./context_manager";
import { log } from "./logger";
import { Unleash } from "unleash-client";

export async function isFeatureEnabled(extensionName: string, featureToggleName: string): Promise<boolean> {
  const ftName = `${extensionName}.${featureToggleName}`;
  try {
    if (!extensionName) {
      throw new Error("Feature toggle extension name can not be empty, null or undefined");
    }

    if (!featureToggleName) {
      throw new Error("Feature toggle name can not be empty, null or undefined");
    }

    //get unleash client
    const client: Unleash = await clientManager.getUnleashClient(extensionName);

    // get the context
    const context: Context = contextManager.getContext(extensionName);

    //check if the feature is enabled
    //fallback value is false (3rd parameter)
    return client.isEnabled(ftName, context, false);
  } catch (err) {
    const logErr = `[ERROR] Failed to determine if feature toggle ${ftName} is enabled. Returning feature DISABLED. Error message: ${err}`;
    log(logErr);
    return false; // error creating an Unleash client -> return feature is disabled
  }
}
