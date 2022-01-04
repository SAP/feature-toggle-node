import { expect } from "chai";
import * as sinon from "sinon";
import { describe, afterEach, it } from "mocha";
import * as API from "../src/api";
import * as logger from "../src/logger";
import * as Request from "../src/request";
import * as Strategies from "../src/strategy_matching";
import { Cache } from "../src/cache";

describe("isFeatureEnabled", () => {
  afterEach(() => {
    sinon.restore();
  });

  const testFailure = async (extensionName: string, featureToggleName: string, errMessage: string): Promise<void> => {
    const loggerSpy = sinon.stub(logger, "log");
    const isFeatureEnabled = await API.isFeatureEnabled(extensionName, featureToggleName);

    expect(isFeatureEnabled).to.be.false; // on error return false
    expect(loggerSpy.callCount).to.equal(2);

    const infoMessage = `Checking if Extension Name: "${extensionName}", Feature Toggle Name: "${featureToggleName}" is enabled`;
    expect(loggerSpy.args[0][0]).to.equal(infoMessage); // infoMessage
    expect(loggerSpy.args[1][0]).to.equal(errMessage); // exception error
  };

  it("extension name is empty - throw Error and return false", async () => {
    const errMessage = `[ERROR] Failed to determine if feature toggle .aaa is enabled. Returning feature DISABLED. Error message: Error: Feature toggle extension name can not be empty, null or undefined`;
    await testFailure("", "aaa", errMessage);
  });

  it("featureToggleName is empty - throw Error and return false", async () => {
    const errMessage = `[ERROR] Failed to determine if feature toggle bla. is enabled. Returning feature DISABLED. Error message: Error: Feature toggle name can not be empty, null or undefined`;
    await testFailure("bla", "", errMessage);
  });

  it("toggle name found in cache by key - return true", async () => {
    const extensionName = "ext";
    const featureToggleName = "ftName";

    sinon.stub(Cache, "getToggleByKey").returns(true);

    const isEnabled = await API.isFeatureEnabled(extensionName, featureToggleName);
    expect(isEnabled).to.be.true;
  });

  function stubDependencies(features: API.Features): void {
    sinon.stub(Request, "requestFeatureToggles").resolves(features);
    sinon.stub(Strategies, "isToggleEnabled").returns(true);
    sinon.stub(Cache, "getFeatureToggles").returns(undefined);
    sinon.stub(Cache, "setFeatureToggles").returns();
    sinon.stub(Cache, "getToggleByKey").returns(undefined);
    sinon.stub(Cache, "setTogglesByKey").returns();
  }

  it("toggle name not presented in toggles list - return false", async () => {
    const extensionName = "ext";
    const featureToggleName = "wrongName";
    const features = {
      features: [
        {
          name: "ext.ftName",
          description: "enabled",
          strategies: false,
          disabled: false,
        } as API.Toggle,
      ],
    };

    stubDependencies(features);
    const isEnabled = await API.isFeatureEnabled(extensionName, featureToggleName);
    expect(isEnabled).to.be.false;
  });

  it("toggle name not presented in cache and found in toggles list - return true", async () => {
    const extensionName = "ext";
    const featureToggleName = "ftName";
    const features: API.Features = {
      features: [
        {
          name: "ext.ftName",
          description: "enabled",
          strategies: false,
          disabled: false,
        } as API.Toggle,
      ],
    };

    stubDependencies(features);
    const isEnabled = await API.isFeatureEnabled(extensionName, featureToggleName);
    expect(isEnabled).to.be.true;
  });

  it("response return empty feature toggles list - return false", async () => {
    const extensionName = "ext";
    const featureToggleName = "ftName";
    const features: API.Features = {
      features: [],
    };

    sinon.stub(Request, "requestFeatureToggles").resolves(features);
    sinon.stub(Strategies, "isToggleEnabled").returns(true);
    sinon.stub(Cache, "getFeatureToggles").returns(undefined);
    sinon.stub(Cache, "getToggleByKey").returns(undefined);
    sinon.stub(Cache, "setTogglesByKey").returns();
    const isEnabled = await API.isFeatureEnabled(extensionName, featureToggleName);
    expect(isEnabled).to.be.false;
  });
});
