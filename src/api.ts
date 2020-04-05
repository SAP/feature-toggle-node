import { Unleash } from "unleash-client";
import { Context } from "unleash-client/lib/context";
import * as clientManager from "./unleash_client_manager";
import * as contextManager from "./context_manager";

export async function isFeatureEnabled(extensionName: string, featureToggleName: string): Promise<boolean> {
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
  return client.isEnabled(`${extensionName}.${featureToggleName}`, context, false);
}
