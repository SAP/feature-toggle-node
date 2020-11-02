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
      environments: "",
      infrastructures: undefined,
      landscapes: "",
      subaccounts: null,
      users: "",
      wss: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, null);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns false when no criteria in client (context) match the server (serverParams)", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      environments: "prod",
      infrastructures: "",
      landscapes: "",
      subaccounts: "",
      users: "",
      wss: "",
      tenantids: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentEnvironment: "dev",
      currentInfrastructure: "",
      currentLandscape: "",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
      currentTenantId: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.false;
  });

  it("Test - isEnabled - returns true when currentEnvironment (client) match the server values (serverParams) for environments", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      environments: "prod,dev",
      infrastructures: "",
      landscapes: "",
      subaccounts: "",
      users: "",
      wss: "",
      tenantids: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentEnvironment: "dev",
      currentInfrastructure: "",
      currentLandscape: "",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
      currentTenantId: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentInfrastructure (client) match the server values (serverParams) for infrastructures", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      environments: "",
      infrastructures: "aws,azure,gcp",
      landscapes: "",
      subaccounts: "",
      users: "",
      wss: "",
      tenantids: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentEnvironment: "",
      currentInfrastructure: "aws",
      currentLandscape: "",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
      currentTenantId: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentLandscape (client) match the server values (serverParams) for landscapes", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      environments: "",
      infrastructures: "",
      landscapes: "us20,eu20,jp10",
      subaccounts: "",
      users: "",
      wss: "",
      tenantids: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentEnvironment: "",
      currentInfrastructure: "",
      currentLandscape: "eu20",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
      currentTenantId: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentCfSubAccount (client) match the server values (serverParams) for subaccounts", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      environments: "",
      infrastructures: "",
      landscapes: "",
      subaccounts: "sub1,sub2,sub3",
      users: "",
      wss: "",
      tenantids: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentEnvironment: "",
      currentInfrastructure: "",
      currentLandscape: "",
      currentCfSubAccount: "sub3",
      currentUser: "",
      currentWs: "",
      currentTenantId: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentUser (client) match the server values (serverParams) for users", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      environments: "",
      infrastructures: "",
      landscapes: "",
      subaccounts: "",
      users: "koko@koko.com, koko4@koko.com",
      wss: "",
      tenantids: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentEnvironment: "",
      currentInfrastructure: "",
      currentLandscape: "",
      currentCfSubAccount: "sub3",
      currentUser: "koko@koko.com",
      currentWs: "",
      currentTenantId: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentWs (client) match the server values (serverParams) for wss", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      environments: "",
      infrastructures: "",
      landscapes: "",
      subaccounts: "",
      users: "",
      wss: "ws-wer,ws-popo,ws-koko",
      tenantids: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentEnvironment: "",
      currentInfrastructure: "",
      currentLandscape: "",
      currentCfSubAccount: "sub3",
      currentUser: "",
      currentWs: "ws-wer",
      currentTenantId: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when currentTenantId (client) match the server values (serverParams) for tenantids", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      environments: "",
      infrastructures: "",
      landscapes: "",
      subaccounts: "",
      users: "",
      wss: "",
      tenantids: "111-a111-111, 222-b222-222",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentEnvironment: "",
      currentInfrastructure: "",
      currentLandscape: "",
      currentCfSubAccount: "sub3",
      currentUser: "",
      currentWs: "",
      currentTenantId: "111-a111-111",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns true when environments does not match but infrastructures do match", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      environments: "prod",
      infrastructures: "aws,azure,gcp",
      landscapes: "",
      subaccounts: "",
      users: "",
      wss: "",
      tenantids: "",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentEnvironment: "dev",
      currentInfrastructure: "aws",
      currentLandscape: "",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
      currentTenantId: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.true;
  });

  it("Test - isEnabled - returns false for serverParams with parameters and context with no parameters", () => {
    const serverParams: appstudioStrategy.AppStudioMultiParameters = {
      environments: "prod",
      infrastructures: "aws,azure,gcp",
      landscapes: "region1",
      subaccounts: "subaccount1",
      users: "user1",
      wss: "wss1",
      tenantids: "111-a111-111",
    };
    const context: appstudioContext.AppStudioMultiContext = {
      currentEnvironment: "",
      currentInfrastructure: "",
      currentLandscape: "",
      currentCfSubAccount: "",
      currentUser: "",
      currentWs: "",
      currentTenantId: "",
    };

    const isEnabled = appStudioMultiStrategy.isEnabled(serverParams, context);

    expect(isEnabled).to.be.false;
  });
});
