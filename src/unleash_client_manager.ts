import { Unleash } from "unleash-client";
import * as ServerArgs from "./server_arguments";
import { initializeUnleashClient } from "./unleash_client_wrapper";
import { AppStudioMultiStrategy } from "./appstudio_strategy";

// Map of Unleash clients.
// map key = extensionName
// map value = Unleash client
const unleashClientMap = new Map<string, Unleash>();

async function createNewUnleashClient(extensionName: string): Promise<Unleash> {
  //get server env arguments
  const serverArgs = ServerArgs.getServerArgs();

  //init client
  const client = await initializeUnleashClient(extensionName, serverArgs, [new AppStudioMultiStrategy()]);

  //add the client to the map
  unleashClientMap.set(extensionName, client);

  return client;
}

export async function getUnleashClient(extensionName: string): Promise<Unleash> {
  // If the client exist in the map return it
  const unleashClient = unleashClientMap.get(extensionName);
  if (unleashClient) {
    return unleashClient;
  }

  // The client does NOT exist in the map -> create a new client
  return createNewUnleashClient(extensionName);
}
