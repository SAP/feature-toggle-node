import { expect } from "chai";
import * as sinon from "sinon";
import { describe, afterEach, beforeEach, it } from "mocha";
import * as unleashClient from "unleash-client";
import { UnleashConfig } from "unleash-client/lib/unleash";
import * as clientManager from "../src/unleash_client_manager";
import * as serverArgs from "../src/server_arguments";
import * as unleashClientWrapper from "../src/unleash_client_wrapper";
import * as appStudioStrategies from "../src/strategy/appStudioStrategies";

describe("Test unleash client manager", () => {
  const extensionNameA = "aaa";
  const extensionNameB = "bbb";
  let serverArgsMock;
  let unleashClientMap;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    unleashClientMap = new Map<string, unleashClient.Unleash>();

    // stub env params
    serverArgsMock = serverArgs.ServerArgs = {
      ftServerEndPoint: "",
      ftServerInterval: 0,
    };
    sinon.stub(serverArgs, "getServerArgs").returns(serverArgsMock);
  });

  const prepGetUnleashClientTests = (): void => {
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
  };

  it("Test getUnleashClient - positive flow", async () => {
    prepGetUnleashClientTests();

    // create unleash client - NOT in cache -> create a new one
    const clientACreated = await clientManager.getUnleashClientFromMap(extensionNameA, unleashClientMap);
    // create unleash client - in cache -> only get from cache
    const clientAFromCache = await clientManager.getUnleashClientFromMap(extensionNameA, unleashClientMap);

    // same instance, ref compare
    expect(clientACreated === clientAFromCache).to.be.true;
  });

  it("Test getUnleashClient - not fetching from cache when when using different extensions names", async () => {
    prepGetUnleashClientTests();

    // create unleash client - NOT in cache -> create a new one
    const clientACreated = await clientManager.getUnleashClientFromMap(extensionNameA, unleashClientMap);
    // create unleash client - NOT in cache -> create a new one
    const clientBCreated = await clientManager.getUnleashClientFromMap(extensionNameB, unleashClientMap);

    // NOT same instance, ref compare
    expect(clientACreated === clientBCreated).to.be.false;
  });

  it("Test initializeUnleashClient - to throw error when client creation promise was rejected", async () => {
    // stub the unleash client
    sinon.stub(unleashClient, "initialize").returns({} as unleashClient.Unleash);

    const err = await clientManager.getUnleashClientFromMap(extensionNameA, unleashClientMap).catch((err) => err.message);
    expect(err).to.equal("Failed to create Unleash client for extension aaa. Error message: TypeError: client.on is not a function");
  });

  it("registerStrategies is called when creating a new client", async () => {
    prepGetUnleashClientTests();

    const registerSpy = sinon.spy(appStudioStrategies, "registerStrategies");

    // create a new client
    await clientManager.getUnleashClientFromMap(extensionNameA, unleashClientMap);

    expect(registerSpy.callCount).to.equal(1);
  });

  it("Block error is thrown when number of attempts to create new unleash client is more than 2", async () => {
    // stub the unleash client
    sinon.stub(unleashClient, "initialize").returns({} as unleashClient.Unleash);

    await clientManager.getUnleashClientFromMap(extensionNameA, unleashClientMap).catch((err) => err.message);
    await clientManager.getUnleashClientFromMap(extensionNameA, unleashClientMap).catch((err) => err.message);
    const err3 = await clientManager.getUnleashClientFromMap(extensionNameA, unleashClientMap).catch((err) => err.message);
    expect(err3).to.contain("Attempts will be blocked for the next 10 min");
  });

  describe("Test handleUnauthorisedCalls - ", () => {
    let initializeTestAttemptMap: Map<string, clientManager.InitializeAttempt>;
    const testExtension = "test";

    afterEach(() => {
      sinon.restore();
    });

    beforeEach(() => {
      initializeTestAttemptMap = new Map<string, clientManager.InitializeAttempt>();
    });

    it("throws error when calls status is blocked and time difference between calls is less then 10 min", () => {
      initializeTestAttemptMap.set(testExtension, { numAttempt: 2, timeAttempt: Date.now(), isBlocked: true });
      try {
        clientManager.handleUnauthorisedCalls(testExtension, initializeTestAttemptMap);
      } catch (err) {
        expect(err.message).to.contain("Attempts will be blocked for the next 10 min.");
      }
    });

    it("doesnt throw error when calls status is blocked and block period is over", () => {
      const lastAttemptTime = Date.now() - 20 * 60 * 1000;
      initializeTestAttemptMap.set(testExtension, { numAttempt: 2, timeAttempt: lastAttemptTime, isBlocked: true });
      clientManager.handleUnauthorisedCalls(testExtension, initializeTestAttemptMap);
      expect(initializeTestAttemptMap.get(testExtension)?.numAttempt).to.equal(0);
      expect(initializeTestAttemptMap.get(testExtension)?.isBlocked).to.be.false;
    });

    it("doesnt throw error when there is an attempt to initialize client for the first time", async () => {
      clientManager.handleUnauthorisedCalls(testExtension, initializeTestAttemptMap);
      expect(initializeTestAttemptMap.get(testExtension)?.numAttempt).to.be.undefined;
    });
  });
});
