import { Unleash } from "unleash-client";
import * as ServerArgs from "./server_arguments";
import { initializeUnleashClient } from "./unleash_client_wrapper";
import { AppStudioMultiStrategy } from "./strategy/appStudioMultiStrategy";
import { registerStrategies } from "./strategy/appStudioStrategies";

// Map of Unleash clients.
// map key = extensionName
// map value = Unleash client
const unleashClientMap = new Map<string, Unleash>();

interface InitializeAttempt {
  numAttempt: number;
  timeAttempt: Date;
}

// map key = extensionName
// map value = number of attempts to establish unleash client
const initializeAttemptMap = new Map<string, InitializeAttempt>();
const limitNumber = 2;

function handleUnauthorisedError(extensionName: string): void {
  let num = initializeAttemptMap.get(extensionName)?.numAttempt;
  num = (num || 0) + 1;
  initializeAttemptMap.set(extensionName, { numAttempt: num, timeAttempt: new Date() });
}

async function createNewUnleashClient(extensionName: string, unleashClientMap: Map<string, Unleash>): Promise<Unleash> {
  try {
    //get server env arguments
    const serverArgs = ServerArgs.getServerArgs();

    //init client
    const appStudioMultiStrategy = new AppStudioMultiStrategy();

    const client = await initializeUnleashClient(extensionName, serverArgs, [appStudioMultiStrategy]);

    registerStrategies(appStudioMultiStrategy);

    //add the client to the map
    unleashClientMap.set(extensionName, client);
    initializeAttemptMap.set(extensionName, { numAttempt: 0, timeAttempt: new Date() });

    return client;
  } catch (e) {
    handleUnauthorisedError(extensionName);
    throw e;
  }
}

export async function getUnleashClientFromMap(extensionName: string, unleashClientMap: Map<string, Unleash>): Promise<Unleash> {
  // If the client exist in the map return it
  const unleashClient = unleashClientMap.get(extensionName);
  if (unleashClient) {
    return unleashClient;
  }

  // handle unauthorised calls. Once limit is reached, no calls for creation of new unleash client will be issued to server.
  const attemptNumber = initializeAttemptMap.get(extensionName)?.numAttempt;

  if (attemptNumber && attemptNumber >= limitNumber) {
    throw new Error(`The limit of attempts to create unleash client for ${extensionName} has been reached.`);
  }

  // The client does NOT exist in the map -> create a new client
  return createNewUnleashClient(extensionName, unleashClientMap);
}

export async function getUnleashClient(extensionName: string): Promise<Unleash> {
  return getUnleashClientFromMap(extensionName, unleashClientMap);
}
