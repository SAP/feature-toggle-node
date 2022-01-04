import { log } from "./logger";
import * as https from "http";
import { Features } from "./api";

const SERVER_ENDPOINT = "http://ft-manager.feature-toggle.svc.cluster.local/v1/features";

export function requestFeatureToggles(): Promise<Features> {
  return new Promise((resolve, reject) => {
    https
      .get(SERVER_ENDPOINT, (res) => {
        log("Get Toggles from server with Status Code: " + res.statusCode);

        const data: Uint8Array[] = [];
        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("end", () => {
          resolve(JSON.parse(Buffer.concat(data).toString()));
        });
      })
      .on("error", (e) => {
        console.error(e);
        reject(e);
      });
  });
}
