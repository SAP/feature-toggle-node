import { afterEach, describe, it } from "mocha";
import * as sinon from "sinon";
import { expect } from "chai";
import * as Cache from "../src/cache";
import * as Request from "../src/request";
import * as Strategies from "../src/strategies";
import * as Client from "../src/client";

describe("findToggleAndReturnState", () => {
  afterEach(() => {
    sinon.restore();
  });

  function stubDependencies(features: Client.Features): void {
    sinon.stub(Request, "requestFeatureToggles").resolves(features);
    sinon.stub(Strategies, "isToggleEnabled").returns(true);
    sinon.stub(Cache, "getFeatureToggles").returns(undefined);
    sinon.stub(Cache, "setFeatureToggles").returns();
    sinon.stub(Cache, "getToggleByKey").returns(undefined);
    sinon.stub(Cache, "setTogglesByKey").returns();
  }

  it("toggle name found in cache by key - return true", async () => {
    const ftName = "ext.ftName";

    sinon.stub(Cache, "getToggleByKey").returns(true);

    const isEnabled = await Client.findToggleAndReturnState(ftName);
    expect(isEnabled).to.be.true;
  });

  it("toggle name not presented in toggles list - return false", async () => {
    const ftName = "ext.wrongName";
    const features = {
      features: [
        {
          name: "ext.ftName",
          description: "enabled",
          strategies: false,
          disabled: false,
        } as Client.Toggle,
      ],
    };

    stubDependencies(features);
    const isEnabled = await Client.findToggleAndReturnState(ftName);
    expect(isEnabled).to.be.false;
  });

  it("toggle name not presented in cache and found in toggles list - return true", async () => {
    const ftName = "ext.ftName";
    const features: Client.Features = {
      features: [
        {
          name: "ext.ftName",
          description: "enabled",
          strategies: false,
          disabled: false,
        } as Client.Toggle,
      ],
    };

    stubDependencies(features);
    const isEnabled = await Client.findToggleAndReturnState(ftName);
    expect(isEnabled).to.be.true;
  });

  it("response return empty feature toggles list - return false", async () => {
    const ftName = "ext.ftName";
    const features: Client.Features = {
      features: [],
    };

    sinon.stub(Request, "requestFeatureToggles").resolves(features);
    sinon.stub(Strategies, "isToggleEnabled").returns(true);
    const isEnabled = await Client.findToggleAndReturnState(ftName);
    expect(isEnabled).to.be.false;
  });

  it("gets feature toggles list from cache - return true", async () => {
    const ftName = "ext.ftName";
    const features: Client.Features = {
      features: [
        {
          name: "ext.ftName",
          description: "enabled",
          strategies: false,
          disabled: false,
        } as Client.Toggle,
      ],
    };

    sinon.stub(Request, "requestFeatureToggles").resolves(undefined);
    sinon.stub(Strategies, "isToggleEnabled").returns(true);
    sinon.stub(Cache, "getFeatureToggles").returns(features);
    const isEnabled = await Client.findToggleAndReturnState(ftName);
    expect(isEnabled).to.be.true;
  });
});
