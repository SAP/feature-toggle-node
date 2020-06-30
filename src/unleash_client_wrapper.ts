import { initialize, Unleash, Strategy } from "unleash-client";
import { log } from "./logger";
import { ServerArgs } from "./server_arguments";
import to from "await-to-js";

async function getUnleashClientReadyPromise(extensionName: string, client: Unleash, serverArgs: ServerArgs): Promise<void> {
  return new Promise((resolve, reject) => {
    client.on("warn", log);
    client.once("error", (err: Error) => {
      log(`[ERROR] FT is initialization failed for extension ${extensionName}. EndPoint: ${serverArgs.ftServerEndPoint}`);
      reject(err);
    });
    client.once("registered", () => {
      log(`FT is initialized to server for extension ${extensionName}. EndPoint: ${serverArgs.ftServerEndPoint}`);
      resolve();
    });
  });
}

export async function initializeUnleashClient(extensionName: string, serverArgs: ServerArgs, customStrategies: Strategy[]): Promise<Unleash> {
  //create a new unleash client
  const unleashClient = initialize({
    appName: extensionName,
    refreshInterval: serverArgs.ftServerInterval,
    url: serverArgs.ftServerEndPoint,
    strategies: customStrategies,
    //customHeaders: {"authorization" : ""},
  });

  const unleashClientReadyPromise = getUnleashClientReadyPromise(extensionName, unleashClient, serverArgs);
  const [err] = await to(unleashClientReadyPromise);
  if (err) {
    throw new Error(`Failed to create Unleash client for extension ${extensionName}. Error message: ${err}`);
  }
  return unleashClient;
}
