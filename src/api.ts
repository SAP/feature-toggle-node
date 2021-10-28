import { Context } from "unleash-client/lib/context";
import * as clientManager from "./unleash_client_manager";
import * as contextManager from "./context_manager";
import { log } from "./logger";
import { Unleash } from "unleash-client";

// map key = extensionName
// map value = number of attempts to establish unleash client
const initializeAttemptMap = new Map<string, number>();
const limitNumber = 2;

function handleUnauthorisedError(extensionName: string, logError: string): void {
  if (logError.includes("401")) {
    let num = initializeAttemptMap.get(extensionName);
    num = (num || 0) + 1;
    initializeAttemptMap.set(extensionName, num);
  }
}

export async function isFeatureEnabled(extensionName: string, featureToggleName: string): Promise<boolean> {
  log(`Checking if Extension Name: "${extensionName}", Feature Toggle Name: "${featureToggleName}" is enabled`);

  const ftName = `${extensionName}.${featureToggleName}`;

  try {
    if (!extensionName) {
      throw new Error("Feature toggle extension name can not be empty, null or undefined");
    }

    if (!featureToggleName) {
      throw new Error("Feature toggle name can not be empty, null or undefined");
    }

    // handle unauthorised calls. Once limit is reached, no calls for creation of new unleash client will be issued to server.
    const attemptNumber = initializeAttemptMap.get(extensionName);
    if (attemptNumber && attemptNumber >= limitNumber) {
      throw new Error(`The limit of attempts to create unleash client for ${extensionName} has been reached.`);
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
    handleUnauthorisedError(extensionName, logErr);
    return false; // error creating an Unleash client -> return feature is disabled
  }
}
