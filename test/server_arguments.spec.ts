/* eslint-disable  @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import * as sinon from "sinon";
import { describe, afterEach, it } from "mocha";
import * as ServerUtil from "../src/server_arguments";

describe("Server arguments tests", () => {
  const REFRESH_INTERVAL = 60000 * 30;
  afterEach(() => {
    sinon.restore();
  });

  it("Test getServerArgs - positive flow", () => {
    sinon.stub(process, "env").value({
      FT_SERVER_ENDPOINT: "testurl",
      FT_TOKEN: "testToken",
    });
    const testServerArgs: ServerUtil.ServerArgs = ServerUtil.getServerArgs();

    expect(testServerArgs.ftServerEndPoint).to.eql("testurl/api/");
    expect(testServerArgs.ftServerInterval).to.eql(REFRESH_INTERVAL);
    expect(testServerArgs.ftServerToken).to.be.eq("testToken");
  });

  it("Test getServerArgs - positive flow - no FT_TOKEN", () => {
    sinon.stub(process, "env").value({
      FT_SERVER_ENDPOINT: "testurl",
    });
    const testServerArgs: ServerUtil.ServerArgs = ServerUtil.getServerArgs();

    expect(testServerArgs.ftServerEndPoint).to.eql("testurl/api/");
    expect(testServerArgs.ftServerInterval).to.eql(REFRESH_INTERVAL);
    expect(testServerArgs.ftServerToken).to.be.undefined;
  });

  it("Test getServerArgs - positive flow - endpoint with trailing slash", () => {
    sinon.stub(process, "env").value({
      FT_SERVER_ENDPOINT: "testurl/",
    });
    const testServerArgs: ServerUtil.ServerArgs = ServerUtil.getServerArgs();

    expect(testServerArgs.ftServerEndPoint).to.eql("testurl/api/");
    expect(testServerArgs.ftServerInterval).to.eql(REFRESH_INTERVAL);
  });

  it("Test getServerArgs - positive flow - endpoint with trailing space", () => {
    sinon.stub(process, "env").value({
      FT_SERVER_ENDPOINT: "testurl/ ",
    });
    const testServerArgs: ServerUtil.ServerArgs = ServerUtil.getServerArgs();

    expect(testServerArgs.ftServerEndPoint).to.eql("testurl/api/");
    expect(testServerArgs.ftServerInterval).to.eql(REFRESH_INTERVAL);
  });

  it("Test getServerArgs - negative flow - endpoint not defined", () => {
    sinon.stub(process, "env").value({
      FT_SERVER_ENDPOINT: "",
      FT_CLIENT_REFRESH_INTERVAL: "",
    });

    expect(() => {
      ServerUtil.getServerArgs();
    }).to.throw("Feature toggle server endpoint (FT_SERVER_ENDPOINT) was NOT found in the environment variables");
  });

  it("Test getServerArgs - positive flow - interval not defined -> use default value", () => {
    sinon.stub(process, "env").value({
      FT_SERVER_ENDPOINT: "testurl",
    });
    const testServerArgs: ServerUtil.ServerArgs = ServerUtil.getServerArgs();

    expect(testServerArgs.ftServerEndPoint).to.eql("testurl/api/");
    expect(testServerArgs.ftServerInterval).to.eql(REFRESH_INTERVAL);
  });

  it("Test getServerArgs - positive flow - interval is empty string -> use default value", () => {
    sinon.stub(process, "env").value({
      FT_SERVER_ENDPOINT: "testurl ",
      FT_CLIENT_REFRESH_INTERVAL: "",
    });
    const testServerArgs: ServerUtil.ServerArgs = ServerUtil.getServerArgs();

    expect(testServerArgs.ftServerEndPoint).to.eql("testurl/api/");
    expect(testServerArgs.ftServerInterval).to.eql(REFRESH_INTERVAL);
  });

  it("Test getServerArgs - positive flow - interval in the wrong format -> use default value", () => {
    sinon.stub(process, "env").value({
      FT_SERVER_ENDPOINT: "testurl ",
      FT_CLIENT_REFRESH_INTERVAL: "8",
    });
    const testServerArgs: ServerUtil.ServerArgs = ServerUtil.getServerArgs();

    expect(testServerArgs.ftServerEndPoint).to.eql("testurl/api/");
    expect(testServerArgs.ftServerInterval).to.eql(REFRESH_INTERVAL);
  });
});
