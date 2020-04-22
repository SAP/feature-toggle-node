import { expect } from "chai";
import * as sinon from "sinon";
import { describe, afterEach, it } from "mocha";
import * as appstudioStrategy from "../src/appstudio_strategy";
import * as appstudioContext from "../src/appstudio_context";

describe("Strategy unit tests", () => {
  const appStudioMultiStrategy = new appstudioStrategy.AppStudioMultiStrategy();

  afterEach(() => {
    sinon.restore();
  });

  it("Test - isEnabled - returns true when data from server (parameters) are not defined i.e. empty ,undefined or null", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      apps: "",
      iaass: undefined,
      regions: "",
      subaccounts: null,
      users: "",
      wss: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, null);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns false when no criteria in client (context) match the server (serverParams)", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      apps: "prod",
      iaass: "",
      regions: "",
      subaccounts: "",
      users: "",
      wss: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentApp: "dev",
      currentIaas: "",
      currentRegion: "",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.false;
  });

  it("Test - isEnabled - returns true when currentApp (client) match the server values (serverParams) for apps", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      apps: "prod,dev",
      iaass: "",
      regions: "",
      subaccounts: "",
      users: "",
      wss: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentApp: "dev",
      currentIaas: "",
      currentRegion: "",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentIaas (client) match the server values (serverParams) for iaass", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      apps: "",
      iaass: "aws,azure,gcp",
      regions: "",
      subaccounts: "",
      users: "",
      wss: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentApp: "",
      currentIaas: "aws",
      currentRegion: "",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentRegion (client) match the server values (serverParams) for regions", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      apps: "",
      iaass: "",
      regions: "us20,eu20,jp10",
      subaccounts: "",
      users: "",
      wss: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentApp: "",
      currentIaas: "",
      currentRegion: "eu20",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentCfSubAccount (client) match the server values (serverParams) for subaccounts", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      apps: "",
      iaass: "",
      regions: "",
      subaccounts: "sub1,sub2,sub3",
      users: "",
      wss: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentApp: "",
      currentIaas: "",
      currentRegion: "",
      currentCfSubAccount: "sub3",
      currentUser: "",
      currentWs: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentUser (client) match the server values (serverParams) for users", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      apps: "",
      iaass: "",
      regions: "",
      subaccounts: "",
      users: "koko@koko.com, koko4@koko.com",
      wss: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentApp: "",
      currentIaas: "",
      currentRegion: "",
      currentCfSubAccount: "sub3",
      currentUser: "koko@koko.com",
      currentWs: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentWs (client) match the server values (serverParams) for wss", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      apps: "",
      iaass: "",
      regions: "",
      subaccounts: "",
      users: "",
      wss: "ws-wer,ws-popo,ws-koko",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentApp: "",
      currentIaas: "",
      currentRegion: "",
      currentCfSubAccount: "sub3",
      currentUser: "",
      currentWs: "ws-wer",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when apps does not match but iaass do match", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      apps: "prod",
      iaass: "aws,azure,gcp",
      regions: "",
      subaccounts: "",
      users: "",
      wss: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentApp: "dev",
      currentIaas: "aws",
      currentRegion: "",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns false for serverParams with parameters and context with no parameters", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      apps: "prod",
      iaass: "aws,azure,gcp",
      regions: "region1",
      subaccounts: "subaccount1",
      users: "user1",
      wss: "wss1",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentApp: "",
      currentIaas: "",
      currentRegion: "",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.false;
  });
});
