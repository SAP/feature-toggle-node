import { afterEach, describe, it } from "mocha";
import * as sinon from "sinon";
import * as CurrentContext from "../src/current_context";
import { expect } from "chai";
import { IterateableContext, isToggleEnabled } from "../src/strategy_matching";
import { Toggle } from "../src/api";
import { ContextData } from "../lib/current_context";

describe("isToggleEnabled", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("toggle enabled and has no strategies return true", async () => {
    const toggle = {
      name: "ext.ftName",
      description: "enabled",
      strategies: false,
      disabled: false,
    } as Toggle;

    sinon.stub(CurrentContext, "createContextEntity").returns({} as IterateableContext);

    const isEnabled = await isToggleEnabled(toggle);
    expect(isEnabled).to.be.true;
  });

  it("toggle disabled and has no strategies return false", async () => {
    const toggle = {
      name: "ext.ftName",
      description: "enabled",
      strategies: false,
      disabled: true,
    } as Toggle;

    sinon.stub(CurrentContext, "createContextEntity").returns({} as IterateableContext);

    const isEnabled = await isToggleEnabled(toggle);
    expect(isEnabled).to.be.false;
  });

  it("toggle disabled and has strategies return false", async () => {
    const toggle = {
      name: "ext.ftName",
      description: "enabled",
      strategies: true,
      disabled: true,
      environments: ["test", "test1"],
    } as Toggle;

    const contextParams = {
      environment: "test",
      infrastructure: "",
      landscape: "",
      subaccount: "",
      user: "",
      ws: "",
      tenantid: "",
    } as ContextData;

    sinon.stub(CurrentContext, "createContextEntity").returns(contextParams as ContextData);

    const isEnabled = await isToggleEnabled(toggle);
    expect(isEnabled).to.be.false;
  });

  it("toggle enabled and has correct environment strategy return true", async () => {
    const toggle = {
      name: "ext.ftName",
      description: "enabled",
      strategies: true,
      disabled: false,
      environments: ["test", "test1"],
    } as Toggle;

    const contextParams = {
      environment: "test",
      infrastructure: "",
      landscape: "",
      subaccount: "",
      user: "",
      ws: "",
      tenantid: "",
    } as ContextData;

    sinon.stub(CurrentContext, "createContextEntity").returns(contextParams as ContextData);

    const isEnabled = await isToggleEnabled(toggle);
    expect(isEnabled).to.be.true;
  });

  it("toggle enabled and has no correct environment strategy return false", async () => {
    const toggle = {
      name: "ext.ftName",
      description: "enabled",
      strategies: true,
      disabled: false,
      environments: ["test1", "test2"],
    } as Toggle;

    const contextParams = {
      environment: "test",
      infrastructure: "",
      landscape: "",
      subaccount: "",
      user: "",
      ws: "",
      tenantid: "",
    } as ContextData;

    sinon.stub(CurrentContext, "createContextEntity").returns(contextParams as ContextData);

    const isEnabled = await isToggleEnabled(toggle);
    expect(isEnabled).to.be.false;
  });

  it("toggle enabled and has all correct strategies except tenantid return false", async () => {
    const toggle = {
      name: "ext.ftName",
      description: "enabled",
      strategies: true,
      disabled: false,
      environments: ["test1", "test2"],
      landscapes: ["landscape1"],
      subaccounts: ["subaccount1"],
      users: ["user1"],
      wss: ["ws1"],
      tenantids: ["tenantid"],
    } as Toggle;

    const contextParams = {
      environment: "test1",
      infrastructure: "",
      landscape: "landscape1",
      subaccount: "subaccount1",
      user: "user1",
      ws: "ws1",
      tenantid: "wrongId",
    } as ContextData;

    sinon.stub(CurrentContext, "createContextEntity").returns(contextParams as ContextData);

    const isEnabled = await isToggleEnabled(toggle);
    expect(isEnabled).to.be.false;
  });

  it("toggle enabled and has all correct strategies return true", async () => {
    const toggle = {
      name: "ext.ftName",
      description: "enabled",
      strategies: true,
      disabled: false,
      environments: ["test1", "test2"],
      landscapes: ["landscape1"],
      subaccounts: ["subaccount1"],
      users: ["user1"],
      wss: ["ws1"],
      tenantids: ["tenantid"],
    } as Toggle;

    const contextParams = {
      environment: "test1",
      infrastructure: "",
      landscape: "landscape1",
      subaccount: "subaccount1",
      user: "user1",
      ws: "ws1",
      tenantid: "tenantid",
    } as ContextData;

    sinon.stub(CurrentContext, "createContextEntity").returns(contextParams as ContextData);

    const isEnabled = await isToggleEnabled(toggle);
    expect(isEnabled).to.be.true;
  });
});
