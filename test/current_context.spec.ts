import { afterEach, describe, it } from "mocha";
import * as sinon from "sinon";
import * as logger from "../src/logger";
import { expect } from "chai";
import { createContextEntity } from "../lib/current_context";

describe("createContextEntity", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("save env variables and check that equal", () => {
    const envValues = {
      USER_NAME: "test_user",
      LANDSCAPE_ENVIRONMENT: "test_landscape",
      LANDSCAPE_NAME: "test_landscape_name",
      TENANT_ID: "test_tenant_id",
      TENANT_NAME: "test_tenant_name",
      WORKSPACE_ID: "test_worksscape_id",
    };
    sinon.stub(process, "env").value(envValues);

    const currentContext = createContextEntity();
    logger.log("some message");
    expect(currentContext.landscape).to.equal(envValues.LANDSCAPE_NAME);
    expect(currentContext.environment).to.equal(envValues.LANDSCAPE_ENVIRONMENT);
    expect(currentContext.subaccount).to.equal(envValues.TENANT_NAME);
    expect(currentContext.user).to.equal(envValues.USER_NAME);
    expect(currentContext.ws).to.equal(envValues.WORKSPACE_ID);
    expect(currentContext.tenantid).to.equal(envValues.TENANT_ID);
  });
});
