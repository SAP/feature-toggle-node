import { initialize, Unleash, Strategy } from "unleash-client";
import { log } from "./logger";
import { ServerArgs } from "./server_arguments";
import to from "await-to-js";
import { UnleashConfig } from "unleash-client/lib/unleash";

async function getUnleashClientRegisteredPromise(client: Unleash): Promise<void> {
  return new Promise((resolve, reject) => {
    client.on("warn", log);
    client.on("error", (err: Error) => {
      reject(err);
    });
    client.once("registered", () => {
      resolve();
    });
  });
}

async function getUnleashClientReadyPromise(client: Unleash): Promise<void> {
  return new Promise((resolve, reject) => {
    client.on("warn", log);
    client.on("error", (err: Error) => {
      reject(err);
    });
    client.once("ready", () => {
      resolve();
    });
  });
}

export async function initializeUnleashClient(extensionName: string, serverArgs: ServerArgs, customStrategies: Strategy[]): Promise<Unleash> {
  //create a new unleash client
  const options: UnleashConfig = {
    appName: extensionName,
    refreshInterval: serverArgs.ftServerInterval,
    metricsInterval: serverArgs.ftServerInterval,
    url: serverArgs.ftServerEndPoint,
    strategies: customStrategies,
  };

  if (serverArgs.ftServerToken) {
    options.customHeaders = { authorization: serverArgs.ftServerToken };
  }
  const unleashClient = initialize(options);

  const readyPromise = getUnleashClientReadyPromise(unleashClient);
  const registeredPromise = getUnleashClientRegisteredPromise(unleashClient);
  const allPromise = Promise.all([readyPromise, registeredPromise]);
  const [err] = await to(allPromise);
  if (err) {
    unleashClient.destroy();
    log(`[ERROR] FT is initialization failed for extension ${extensionName}. EndPoint: ${serverArgs.ftServerEndPoint}`);
    throw new Error(`Failed to create Unleash client for extension ${extensionName}. Error message: ${err}`);
  }
  log(`FT is initialized to server for extension ${extensionName}. EndPoint: ${serverArgs.ftServerEndPoint}`);
  return unleashClient;
}
