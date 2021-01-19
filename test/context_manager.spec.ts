import { expect } from "chai";
import * as sinon from "sinon";
import { describe, afterEach, beforeEach, it } from "mocha";
import * as contextManager from "../src/context_manager";
import { AppStudioMultiContext } from "../src/appstudio_context";

describe("Test context manager", () => {
  const extensionNameA = "aaa";
  const extensionNameB = "bbb";

  const user = "koko@sap.com";
  const env = "prod";
  const landscape = "eu10";
  const tenantId = "111-a11-111";
  const subAccount = "azureconseu";
  const ws = "ws-n8vmz";
  let contextMap;

  afterEach(() => {
    sinon.restore();
  });

  beforeEach(() => {
    sinon.stub(process, "env").value({
      WS_BASE_URL: "https://workspaces-ws-n8vmz.eu20.applicationstudio.cloud.sap/",
      USER_NAME: user,
      LANDSCAPE_ENVIRONMENT: env,
      LANDSCAPE_NAME: landscape,
      TENANT_ID: tenantId,
      TENANT_NAME: subAccount,
    });

    contextMap = new Map<string, AppStudioMultiContext>();
  });

  describe("getContext cache", () => {
    it("return the same instance from cache", () => {
      // create context - NOT in cache -> create a new one
      const contextACreated = contextManager.getContext(extensionNameA);
      // create context - in cache -> only get from cache
      const contextAFromCache = contextManager.getContext(extensionNameA);

      // same instance, ref compare
      expect(contextACreated === contextAFromCache).to.be.true;
    });

    it("return different instances from cache when when using different extensions names", () => {
      // create context - NOT in cache -> create a new one
      const contextACreated = contextManager.getContextFromMap(extensionNameA, contextMap);
      // create context - NOT in cache -> create a new one
      const contextBCreated = contextManager.getContextFromMap(extensionNameB, contextMap);

      // NOT same instance, ref compare
      expect(contextACreated === contextBCreated).to.be.false;
    });
  });

  describe("getContextFromMap", () => {
    function testNoEnvError(extensionName: string, contextMap: Map<string, AppStudioMultiContext>, errorMessage: string): void {
      expect(() => {
        contextManager.getContextFromMap(extensionName, contextMap);
      }).to.throw(errorMessage);
    }

    it("getting the expected context values", () => {
      //WS_BASE_URL: "https://workspaces-ws-n8vmz.eu20.applicationstudio.cloud.sap/",

      const expectedContext: AppStudioMultiContext = {
        currentEnvironment: env,
        currentInfrastructure: "",
        currentLandscape: landscape,
        currentCfSubAccount: subAccount,
        currentUser: user,
        currentWs: ws,
        currentTenantId: tenantId,
      };

      // create context - NOT in cache -> create a new one
      const contextA: AppStudioMultiContext = contextManager.getContextFromMap(extensionNameA, contextMap);

      expect(contextA).to.deep.equal(expectedContext);
    });

    it("getting error for lack of 'workspaces-ws-' in WS_BASE_URL", () => {
      sinon.stub(process, "env").value({
        WS_BASE_URL: "https://azureconseun8vmz.eu20",
        USER_NAME: user,
        LANDSCAPE_ENVIRONMENT: env,
        LANDSCAPE_NAME: landscape,
        TENANT_ID: tenantId,
        TENANT_NAME: subAccount,
      });

      testNoEnvError(extensionNameA, contextMap, `Feature toggle env WS_BASE_URL is NOT in the correct format. Expected format: https://workspaces-ws-<id>.<cluster region>.<domain>/`);
    });

    it("getting error for when using http instead of https in WS_BASE_URL", () => {
      sinon.stub(process, "env").value({
        WS_BASE_URL: "http://workspaces-ws-n8vmz.eu20.applicationstudio.cloud.sap/",
        USER_NAME: user,
        LANDSCAPE_ENVIRONMENT: env,
        LANDSCAPE_NAME: landscape,
        TENANT_ID: tenantId,
        TENANT_NAME: subAccount,
      });

      testNoEnvError(extensionNameA, contextMap, `Feature toggle env WS_BASE_URL is NOT in the correct format. Expected format: https://workspaces-ws-<id>.<cluster region>.<domain>/`);
    });

    it("getting error for no WS_BASE_URL env parameter", () => {
      sinon.stub(process, "env").value({
        USER_NAME: user,
        LANDSCAPE_ENVIRONMENT: env,
        LANDSCAPE_NAME: landscape,
        TENANT_ID: tenantId,
        TENANT_NAME: subAccount,
      });

      testNoEnvError(extensionNameA, contextMap, "Feature toggle env WS_BASE_URL was NOT found in the environment variables");
    });

    it("getting error for no TENANT_NAME env parameter", () => {
      sinon.stub(process, "env").value({
        USER_NAME: user,
        LANDSCAPE_ENVIRONMENT: env,
        LANDSCAPE_NAME: landscape,
        TENANT_ID: tenantId,
      });

      testNoEnvError(extensionNameA, contextMap, "Feature toggle env TENANT_NAME was NOT found in the environment variables");
    });

    it("getting error for no USER_NAME env parameter", () => {
      sinon.stub(process, "env").value({});

      testNoEnvError(extensionNameA, contextMap, "Feature toggle env USER_NAME was NOT found in the environment variables");
    });

    it("getting error for no LANDSCAPE_ENVIRONMENT env parameter", () => {
      sinon.stub(process, "env").value({
        USER_NAME: user,
      });

      testNoEnvError(extensionNameA, contextMap, "Feature toggle env LANDSCAPE_ENVIRONMENT was NOT found in the environment variables");
    });

    it("getting error for no TENANT_ID env parameter", () => {
      sinon.stub(process, "env").value({
        USER_NAME: user,
        LANDSCAPE_ENVIRONMENT: env,
        LANDSCAPE_NAME: landscape,
      });

      testNoEnvError(extensionNameA, contextMap, "Feature toggle env TENANT_ID was NOT found in the environment variables");
    });

    it("getting error for no LANDSCAPE_NAME env parameter", () => {
      sinon.stub(process, "env").value({
        USER_NAME: user,
        LANDSCAPE_ENVIRONMENT: env,
      });

      testNoEnvError(extensionNameA, contextMap, "Feature toggle env LANDSCAPE_NAME was NOT found in the environment variables");
    });
  });
});
