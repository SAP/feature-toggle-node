import { expect } from "chai";
import * as sinon from "sinon";
import { describe, afterEach, beforeEach, it } from "mocha";
import * as contextManager from "../src/context_manager";
import { AppStudioMultiContext } from "../src/appstudio_context";

describe("Test context manager", () => {
  const extensionNameA = "aaa";
  const extensionNameB = "bbb";

  const USER = "koko@sap.com";
  let contextMap;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    sinon.stub(process, "env").value({
      WS_BASE_URL: "https://azureconseu-workspaces-ws-n8vmz.eu20.applicationstudio.cloud.sap/",
      USER_NAME: USER
    });

    contextMap = new Map<string, AppStudioMultiContext>();
  });

  function testNoEnvError(extensionName: string, contextMap: Map<string, AppStudioMultiContext>, errorMessage: string): void {
    expect(() => {
      contextManager.getContextFromMap(extensionName, contextMap);
    }).to.throw(errorMessage);
  }

  function testContext(context: AppStudioMultiContext, subaccount: string, user: string, ws: string): void {
    expect(context.currentApp).to.be.empty;
    expect(context.currentIaas).to.be.empty;
    expect(context.currentRegion).to.be.empty;
    expect(context.currentCfSubAccount).to.equal(subaccount);
    expect(context.currentUser).to.equal(user);
    expect(context.currentWs).to.equal(ws);
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

    // create context - NOT in cache -> create a new one
    const contextA = contextManager.getContextFromMap(extensionNameA, contextMap);

    testContext(contextA, "azureconseu", USER, "ws-n8vmz");
  });

  it("Test context - getContext - getting the expected context values - positive flow", () => {
    sinon.stub(process, "env").value({
      WS_BASE_URL: "https://consumer-trial-workspaces-ws-9gzgq.eu10.trial.applicationstudio.cloud.sap/",
      USER_NAME: USER
    });

    // create context - NOT in cache -> create a new one
    const contextA = contextManager.getContextFromMap(extensionNameA, contextMap);

    testContext(contextA, "consumer-trial", USER, "ws-9gzgq");
  });

  it("Test context - getContext - getting error for lack of '-workspaces-ws-' in WS_BASE_URL - negative flow", () => {
    sinon.stub(process, "env").value({
      WS_BASE_URL: "https://azureconseun8vmz.eu20",
      USER_NAME: USER
    });

    testNoEnvError(extensionNameA, contextMap, `Feature toggle env WS_BASE_URL is NOT in the correct format. Expected format: https://<CF sub account>-workspaces-ws-<id>.<cluster region>.<domain>/`);
  });

  it("Test context - getContext - getting error for when using http instead of https in WS_BASE_URL - negative flow", () => {
    sinon.stub(process, "env").value({
      WS_BASE_URL: "http://azureconseu-workspaces-ws-n8vmz.eu20.applicationstudio.cloud.sap/",
      USER_NAME: USER
    });

    testNoEnvError(extensionNameA, contextMap, `Feature toggle env WS_BASE_URL is NOT in the correct format. Expected format: https://<CF sub account>-workspaces-ws-<id>.<cluster region>.<domain>/`);
  });

  it("Test context - getContext - getting error for no WS_BASE_URL env parameter - negative flow", () => {
    sinon.stub(process, "env").value({
      USER_NAME: USER
    });

    testNoEnvError(extensionNameA, contextMap, "Feature toggle env WS_BASE_URL was NOT found in the environment variables");
  });

  it("Test context - getContext - getting error for no USER_NAME env parameter - negative flow", () => {
    sinon.stub(process, "env").value({
      WS_BASE_URL: "https://azureconseu-workspaces-ws-n8vmz.eu20.applicationstudio.cloud.sap/"
    });

    testNoEnvError(extensionNameA, contextMap, "Feature toggle env USER_NAME was NOT found in the environment variables");
  });
});
