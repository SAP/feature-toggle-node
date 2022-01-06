import { afterEach, describe, it } from "mocha";
import * as sinon from "sinon";
import { expect } from "chai";
import * as Cache from "../src/cache";
import * as Request from "../src/request";
import * as Strategies from "../src/strategies";
import * as Client from "../src/client";
import { updateRefreshInterval } from "../src/client";

describe("findToggleAndReturnState", () => {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    this.clock = sinon.restore();
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
    sinon.stub(Request, "requestFeatureToggles").resolves(undefined);

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

describe("refreshCacheByInterval", () => {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    this.clock = sinon.restore();
  });

  it("checked that requestFeatureToggles called twice in last 20 seconds", function () {
    updateRefreshInterval(10);
    Client.refreshCacheByInterval();

    const features: Client.Features = {
      features: [],
    };
    const spy = sinon.stub(Request, "requestFeatureToggles").resolves(features);
    this.clock.tick(20);
    expect(spy.callCount).to.be.equal(2);
  });
});

describe("flushCacheAndSaveNew", () => {
  afterEach(function () {
    sinon.restore();
  });

  it("not empty feature toggles call flushCache", function () {
    const features: Client.Features = {
      features: [{} as Client.Toggle],
    };
    const FlushSpy = sinon.stub(Cache, "flushCache").returns();
    const SetSpy = sinon.stub(Cache, "setFeatureToggles").returns();
    Client.flushCacheAndSaveNew(features);

    expect(FlushSpy.callCount).to.be.equal(1);
    expect(SetSpy.callCount).to.be.equal(1);
  });

  it("empty feature toggles list not call flushCache and setFeatures", function () {
    const features: Client.Features = {
      features: [],
    };
    const FlushSpy = sinon.stub(Cache, "flushCache").returns();
    const SetSpy = sinon.stub(Cache, "setFeatureToggles").returns();
    Client.flushCacheAndSaveNew(features);

    expect(FlushSpy.callCount).to.be.equal(0);
    expect(SetSpy.callCount).to.be.equal(0);
  });

  it("empty feature toggles object not call flushCache and setFeatures", function () {
    const features: Client.Features = {} as Client.Features;

    const FlushSpy = sinon.stub(Cache, "flushCache");
    const SetSpy = sinon.stub(Cache, "setFeatureToggles");
    Client.flushCacheAndSaveNew(features);

    expect(FlushSpy.callCount).to.be.equal(0);
    expect(SetSpy.callCount).to.be.equal(0);
  });
});
