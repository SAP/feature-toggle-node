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
  timeAttempt: number;
  isBlocked: boolean;
}

// map key = extensionName
// map value = number of attempts to establish unleash client
const initializeAttemptMap = new Map<string, InitializeAttempt>();
const limitNumber = 2;

function handleUnauthorisedError(extensionName: string): void {
  let num = initializeAttemptMap.get(extensionName)?.numAttempt;
  num = (num || 0) + 1;
  if (num < limitNumber) {
    initializeAttemptMap.set(extensionName, { numAttempt: num, timeAttempt: 0, isBlocked: false });
  }
  if (num == limitNumber) {
    initializeAttemptMap.set(extensionName, { numAttempt: num, timeAttempt: Date.now(), isBlocked: true });
  }
}

// handle unauthorised calls. Once limit is reached, no calls for creation of new unleash client will be issued to server.
function handleUnauthorisedCalls(extensionName: string): void {
  const isPending = initializeAttemptMap.get(extensionName)?.isBlocked;

  if (isPending) {
    //get time from map
    const lastAttemptTime = initializeAttemptMap.get(extensionName)?.timeAttempt || Date.now();
    // get time difference from now
    const timeDifference = Math.abs((Date.now() - lastAttemptTime) / (1000 * 60));
    if (timeDifference < 0.2) {
      throw new Error(`The limit of attempts to create unleash client for ${extensionName} has been reached. Attempts will be blocked for the next hour.`);
    }
    initializeAttemptMap.set(extensionName, { numAttempt: 0, timeAttempt: Date.now(), isBlocked: false });
  }
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

  handleUnauthorisedCalls(extensionName);

  // The client does NOT exist in the map -> create a new client
  return createNewUnleashClient(extensionName, unleashClientMap);
}

export async function getUnleashClient(extensionName: string): Promise<Unleash> {
  return getUnleashClientFromMap(extensionName, unleashClientMap);
}
