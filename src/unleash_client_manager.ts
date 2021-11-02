import { Unleash } from "unleash-client";
import * as ServerArgs from "./server_arguments";
import { initializeUnleashClient } from "./unleash_client_wrapper";
import { AppStudioMultiStrategy } from "./strategy/appStudioMultiStrategy";
import { registerStrategies } from "./strategy/appStudioStrategies";

// Map of Unleash clients.
// map key = extensionName
// map value = Unleash client
const unleashClientMap = new Map<string, Unleash>();

export interface InitializeAttempt {
  numAttempt: number;
  timeAttempt: number;
  isBlocked: boolean;
}

// map key = extensionName
// map value = info regarding attempts to establish unleash client
const initializeAttemptMap = new Map<string, InitializeAttempt>();
const limitNumber = 2;

function handleUnauthorisedError(extensionName: string): void {
  let num = initializeAttemptMap.get(extensionName)?.numAttempt;
  num = (num || 0) + 1;
  const isInitBlocked = num == limitNumber;
  initializeAttemptMap.set(extensionName, { numAttempt: num, timeAttempt: Date.now(), isBlocked: isInitBlocked });
}

// block calls for client initialization while in block time period.
export function handleUnauthorisedCalls(extensionName: string, initializeAttemptMap: Map<string, InitializeAttempt>): void {
  const initializationInfo = initializeAttemptMap.get(extensionName);
  if (initializationInfo && initializationInfo.isBlocked) {
    const lastAttemptTime = initializationInfo.timeAttempt;
    const timeDifference = Math.abs((Date.now() - lastAttemptTime) / (1000 * 60));
    const blockPeriod = Math.floor(Math.random() * 3) + 9; //10 min (+-1min)
    if (timeDifference < blockPeriod) {
      throw new Error(`The limit of attempts to create unleash client for ${extensionName} has been reached. Attempts will be blocked for the next 10 min.`);
    }
    // block period is over
    initializeAttemptMap.set(extensionName, { numAttempt: 0, timeAttempt: 0, isBlocked: false });
  }
}

async function createNewUnleashClient(extensionName: string, unleashClientMap: Map<string, Unleash>): Promise<Unleash> {
  //get server env arguments
  const serverArgs = ServerArgs.getServerArgs();

  //init client
  const appStudioMultiStrategy = new AppStudioMultiStrategy();

  const client = await initializeUnleashClient(extensionName, serverArgs, [appStudioMultiStrategy]).catch((err) => {
    handleUnauthorisedError(extensionName);
    throw err;
  });

  registerStrategies(appStudioMultiStrategy);

  //add the client to the map
  unleashClientMap.set(extensionName, client);

  return client;
}

export async function getUnleashClientFromMap(extensionName: string, unleashClientMap: Map<string, Unleash>): Promise<Unleash> {
  // If the client exist in the map return it
  const unleashClient = unleashClientMap.get(extensionName);
  if (unleashClient) {
    return unleashClient;
  }

  handleUnauthorisedCalls(extensionName, initializeAttemptMap);

  // The client does NOT exist in the map -> create a new client
  return createNewUnleashClient(extensionName, unleashClientMap);
}

export async function getUnleashClient(extensionName: string): Promise<Unleash> {
  return getUnleashClientFromMap(extensionName, unleashClientMap);
}
