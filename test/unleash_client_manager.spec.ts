import { expect } from "chai";
import * as sinon from "sinon";
import { describe, afterEach, beforeEach, it } from "mocha";
import * as unleashClient from "unleash-client";
import { UnleashConfig } from "unleash-client/lib/unleash";
import * as clientManager from "../src/unleash_client_manager";
import * as serverArgs from "../src/server_arguments";
import * as unleashClientWrapper from "../src/unleash_client_wrapper";

describe("Test unleash client manager", () => {
  const extensionNameA = "aaa";
  const extensionNameB = "bbb";

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    // stub env params
    const serverArgsMock: serverArgs.ServerArgs = {
      ftServerEndPoint: "",
      ftServerInterval: 0,
    };
    sinon.stub(serverArgs, "getServerArgs").returns(serverArgsMock);

    // stub unleash client
    const unleashConfigA: UnleashConfig = {
      appName: extensionNameA,
      refreshInterval: serverArgsMock.ftServerInterval,
      url: serverArgsMock.ftServerEndPoint,
    };
    const unleashConfigB: UnleashConfig = {
      appName: extensionNameB,
      refreshInterval: serverArgsMock.ftServerInterval,
      url: serverArgsMock.ftServerEndPoint,
    };
    // create stub for the initialize of Unleash interface
    const initializeStub = sinon.stub(unleashClientWrapper, "initializeUnleashClient");
    // return unleash client only if unleashConfigA is passed as parameters
    initializeStub.withArgs(extensionNameA, serverArgsMock).resolves((unleashConfigA as unknown) as unleashClient.Unleash);
    // return unleash client only if unleashConfigB is passed as parameters
    initializeStub.withArgs(extensionNameB, serverArgsMock).resolves((unleashConfigB as unknown) as unleashClient.Unleash);
  });

  it("Test getUnleashClient - positive flow", async () => {
    // create unleash client - NOT in cache -> create a new one
    const clientACreated = await clientManager.getUnleashClient(extensionNameA);
    // create unleash client - in cache -> only get from cache
    const clientAFromCache = await clientManager.getUnleashClient(extensionNameA);

    // same instance, ref compare
    expect(clientACreated === clientAFromCache).to.be.true;
  });

  it("Test getUnleashClient - not fetching from cache when when using different extensions names", async () => {
    // create unleash client - NOT in cache -> create a new one
    const clientACreated = await clientManager.getUnleashClient(extensionNameA);
    // create unleash client - NOT in cache -> create a new one
    const clientBCreated = await clientManager.getUnleashClient(extensionNameB);

    // NOT same instance, ref compare
    expect(clientACreated === clientBCreated).to.be.false;
  });
});
