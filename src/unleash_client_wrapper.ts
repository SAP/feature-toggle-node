import { initialize, Unleash, Strategy } from "unleash-client";
import { log } from "./logger";
import { ServerArgs } from "./server_arguments";

async function getUnleashClientReadyPromise(extensionName: string, client: Unleash, serverArgs: ServerArgs): Promise<void> {
  return new Promise((resolve, reject) => {
    client.on("warn", log);
    client.once("error", (err: Error) => {
      log(`FT is initialization failed for extension ${extensionName}. EndPoint: ${serverArgs.ftServerEndPoint}`);
      reject(err);
    });
    client.once("ready", () => {
      log(`FT is initialized to server for extension ${extensionName}. EndPoint: ${serverArgs.ftServerEndPoint}`);
      resolve();
    });
  });
}

export async function initializeUnleashClient(extensionName: string, serverArgs: ServerArgs, featureStrategies: Strategy[]): Promise<Unleash> {
  //create a new unleash client
  const unleashClient = initialize({
    appName: extensionName,
    refreshInterval: serverArgs.ftServerInterval,
    url: serverArgs.ftServerEndPoint,
    strategies: featureStrategies,
  });

  await getUnleashClientReadyPromise(extensionName, unleashClient, serverArgs);
  return unleashClient;
}
