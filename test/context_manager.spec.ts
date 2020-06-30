import { expect } from "chai";
import * as sinon from "sinon";
import { describe, afterEach, beforeEach, it } from "mocha";
import * as contextManager from "../src/context_manager";
import { AppStudioMultiContext } from "../src/appstudio_context";

describe("Test context manager", () => {
  const extensionNameA = "aaa";
  const extensionNameB = "bbb";

  const USER = "koko@sap.com";
  const ENVIRONMENT = "prod";
  const LANDSCAPE = "eu10";
  let contextMap;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    sinon.stub(process, "env").value({
      WS_BASE_URL: "https://azureconseu-workspaces-ws-n8vmz.eu20.applicationstudio.cloud.sap/",
      USER_NAME: USER,
      LANDSCAPE_ENVIRONMENT: ENVIRONMENT,
      LANDSCAPE_NAME: LANDSCAPE,
    });

    contextMap = new Map<string, AppStudioMultiContext>();
  });

  function testNoEnvError(extensionName: string, contextMap: Map<string, AppStudioMultiContext>, errorMessage: string): void {
    expect(() => {
      contextManager.getContextFromMap(extensionName, contextMap);
    }).to.throw(errorMessage);
  }

  it("Test getContext - positive flow", () => {
    // create context - NOT in cache -> create a new one
    const contextACreated = contextManager.getContext(extensionNameA);
    // create context - in cache -> only get from cache
    const contextAFromCache = contextManager.getContext(extensionNameA);

    // same instance, ref compare
    expect(contextACreated === contextAFromCache).to.be.true;
  });

  it("Test getContext - not fetching from cache when when using different extensions names", () => {
    // create context - NOT in cache -> create a new one
    const contextACreated = contextManager.getContextFromMap(extensionNameA, contextMap);
    // create context - NOT in cache -> create a new one
    const contextBCreated = contextManager.getContextFromMap(extensionNameB, contextMap);

    // NOT same instance, ref compare
    expect(contextACreated === contextBCreated).to.be.false;
  });

  it("Test context - getContext - getting the expected context values - positive flow", () => {
    //WS_BASE_URL: "https://azureconseu-workspaces-ws-n8vmz.eu20.applicationstudio.cloud.sap/",

    const expectedContext: AppStudioMultiContext = {
      currentEnvironment: ENVIRONMENT,
      currentInfrastructure: "",
      currentLandscape: LANDSCAPE,
      currentCfSubAccount: "azureconseu",
      currentUser: USER,
      currentWs: "ws-n8vmz",
    };

    // create context - NOT in cache -> create a new one
    const contextA: AppStudioMultiContext = contextManager.getContextFromMap(extensionNameA, contextMap);

    expect(contextA).to.deep.equal(expectedContext);
  });

  it("Test context - getContext - getting the expected context values - positive flow", () => {
    sinon.stub(process, "env").value({
      WS_BASE_URL: "https://consumer-trial-workspaces-ws-9gzgq.eu10.trial.applicationstudio.cloud.sap/",
      USER_NAME: USER,
      LANDSCAPE_ENVIRONMENT: ENVIRONMENT,
      LANDSCAPE_NAME: LANDSCAPE,
    });

    const expectedContext: AppStudioMultiContext = {
      currentEnvironment: ENVIRONMENT,
      currentInfrastructure: "",
      currentLandscape: LANDSCAPE,
      currentCfSubAccount: "consumer-trial",
      currentUser: USER,
      currentWs: "ws-9gzgq",
    };

    // create context - NOT in cache -> create a new one
    const contextA = contextManager.getContextFromMap(extensionNameA, contextMap);

    expect(contextA).to.deep.equal(expectedContext);
  });

  it("Test context - getContext - getting error for lack of '-workspaces-ws-' in WS_BASE_URL - negative flow", () => {
    sinon.stub(process, "env").value({
      WS_BASE_URL: "https://azureconseun8vmz.eu20",
      USER_NAME: USER,
      LANDSCAPE_ENVIRONMENT: ENVIRONMENT,
      LANDSCAPE_NAME: LANDSCAPE,
    });

    testNoEnvError(extensionNameA, contextMap, `Feature toggle env WS_BASE_URL is NOT in the correct format. Expected format: https://<CF sub account>-workspaces-ws-<id>.<cluster region>.<domain>/`);
  });

  it("Test context - getContext - getting error for when using http instead of https in WS_BASE_URL - negative flow", () => {
    sinon.stub(process, "env").value({
      WS_BASE_URL: "http://azureconseu-workspaces-ws-n8vmz.eu20.applicationstudio.cloud.sap/",
      USER_NAME: USER,
      LANDSCAPE_ENVIRONMENT: ENVIRONMENT,
      LANDSCAPE_NAME: LANDSCAPE,
    });

    testNoEnvError(extensionNameA, contextMap, `Feature toggle env WS_BASE_URL is NOT in the correct format. Expected format: https://<CF sub account>-workspaces-ws-<id>.<cluster region>.<domain>/`);
  });

  it("Test context - getContext - getting error for no WS_BASE_URL env parameter - negative flow", () => {
    sinon.stub(process, "env").value({
      USER_NAME: USER,
      LANDSCAPE_ENVIRONMENT: ENVIRONMENT,
      LANDSCAPE_NAME: LANDSCAPE,
    });

    testNoEnvError(extensionNameA, contextMap, "Feature toggle env WS_BASE_URL was NOT found in the environment variables");
  });

  it("Test context - getContext - getting error for no USER_NAME env parameter - negative flow", () => {
    sinon.stub(process, "env").value({});

    testNoEnvError(extensionNameA, contextMap, "Feature toggle env USER_NAME was NOT found in the environment variables");
  });

  it("Test context - getContext - getting error for no LANDSCAPE_ENVIRONMENT env parameter - negative flow", () => {
    sinon.stub(process, "env").value({
      USER_NAME: USER,
    });

    testNoEnvError(extensionNameA, contextMap, "Feature toggle env LANDSCAPE_ENVIRONMENT was NOT found in the environment variables");
  });

  it("Test context - getContext - getting error for no LANDSCAPE_NAME env parameter - negative flow", () => {
    sinon.stub(process, "env").value({
      USER_NAME: USER,
      LANDSCAPE_ENVIRONMENT: ENVIRONMENT,
    });

    testNoEnvError(extensionNameA, contextMap, "Feature toggle env LANDSCAPE_NAME was NOT found in the environment variables");
  });
});
