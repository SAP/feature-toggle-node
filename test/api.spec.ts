import { expect } from "chai";
import * as sinon from "sinon";
import { describe, afterEach, it } from "mocha";
import { Unleash } from "unleash-client";
import * as API from "../src/api";
import * as clientManager from "../src/unleash_client_manager";
import * as contextManager from "../src/context_manager";
import * as serverArgs from "../src/server_arguments";
import { AppStudioMultiContext } from "../src/appstudio_context";

describe("isFeatureEnabled - negative flows", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("Test - isFeatureEnabled - extension name is empty", async () => {
    sinon.stub(serverArgs, "getServerArgs").returns({ ftServerEndPoint: "test", ftServerInterval: 60000 });
    try {
      await API.isFeatureEnabled("", "aaa");
    } catch (err) {
      expect(err).to.be.an("error");
      expect(err.message).to.not.be.empty;
      expect(err.message).to.equal(`Feature toggle extension name can not be empty, null or undefined`);
    }
  });

  it("Test - isFeatureEnabled - featureToggleName is empty", async () => {
    sinon.stub(serverArgs, "getServerArgs").returns({ ftServerEndPoint: "test", ftServerInterval: 60000 });
    try {
      await API.isFeatureEnabled("bla", "");
    } catch (err) {
      expect(err).to.be.an("error");
      expect(err.message).to.not.be.empty;
      expect(err.message).to.equal(`Feature toggle name can not be empty, null or undefined`);
    }
  });

  it("Test - isFeatureEnabled - endpoint is empty", async () => {
    sinon.stub(serverArgs, "getServerArgs").returns({ ftServerEndPoint: "", ftServerInterval: 60000 });
    try {
      await API.isFeatureEnabled("someName", "aaa");
    } catch (err) {
      expect(err).to.be.an("error");
      expect(err.message).to.not.be.empty;
      expect(err.message).to.contain("Unleash server URL missing");
    }
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
      isEnabled: function(): boolean {
        return true;
      } as unknown
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

  it("Test - true == false ????", async () => {
    expect(false).to.be.true;
  });
});
