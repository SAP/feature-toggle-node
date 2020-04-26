import { expect } from "chai";
import * as sinon from "sinon";
import { describe, afterEach, it } from "mocha";
import { Unleash } from "unleash-client";
import * as API from "../src/api";
import * as clientManager from "../src/unleash_client_manager";
import * as contextManager from "../src/context_manager";
import * as serverArgs from "../src/server_arguments";
import { AppStudioMultiContext } from "../src/appstudio_context";
import * as logger from "../src/logger";

describe("isFeatureEnabled - negative flows", () => {
  afterEach(() => {
    sinon.restore();
  });

  const testFailure = async (extensionName, featureToggleName, errMessage: string): Promise<void> => {
    const loggerSpy = sinon.stub(logger, "log");
    const isFeatureEnabled = await API.isFeatureEnabled(extensionName, featureToggleName);

    expect(isFeatureEnabled).to.be.false; // on error return false
    expect(loggerSpy.callCount).to.equal(1);
    expect(loggerSpy.args[0][0]).to.equal(errMessage); // exception error
  };

  it("Test - isFeatureEnabled - extension name is empty - isFeatureEnabled returns false", async () => {
    const errMessage = `[ERROR] Failed to determine if feature toggle .aaa is enabled. Returning feature DISABLED. Error message: Error: Feature toggle extension name can not be empty, null or undefined`;
    await testFailure("", "aaa", errMessage);
  });

  it("Test - isFeatureEnabled - featureToggleName is empty - isFeatureEnabled returns false", async () => {
    const errMessage = `[ERROR] Failed to determine if feature toggle bla. is enabled. Returning feature DISABLED. Error message: Error: Feature toggle name can not be empty, null or undefined`;
    await testFailure("bla", "", errMessage);
  });

  it("Test - isFeatureEnabled - endpoint is empty - isFeatureEnabled returns false", async () => {
    sinon.stub(serverArgs, "getServerArgs").returns({ ftServerEndPoint: "", ftServerInterval: 60000 });
    const errMessage = `[ERROR] Failed to determine if feature toggle someName.aaa is enabled. Returning feature DISABLED. Error message: Error: Unleash server URL missing`;
    await testFailure("someName", "aaa", errMessage);
  });
});

describe("isFeatureEnabled - positive flows", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Test - isFeatureEnabled - positive flow", async () => {
    const extensionName = "ext";
    const featureToggleName = "ftName";
    const myClient = {
      isEnabled: function (): boolean {
        return true;
      } as unknown,
    } as Unleash;
    const context = {} as AppStudioMultiContext;

    sinon.stub(clientManager, "getUnleashClient").resolves(myClient);
    sinon.stub(contextManager, "getContext").returns(context);
    const clientSpy = sinon.stub(myClient, "isEnabled").returns(true);
    const isEnabled = await API.isFeatureEnabled(extensionName, featureToggleName);
    expect(isEnabled).to.be.true;
    expect(clientSpy.callCount).to.equal(1);
    expect(clientSpy.withArgs(`${extensionName}.${featureToggleName}`, {}).called).to.be.true;
  });
});
