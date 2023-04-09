import * as core from "@actions/core";
import { PubSpecHelper } from "./pubspec.helper";
import { VersionHelper } from "./version.helper";
import { BumpHelper } from "./bump.helper";

const token = core.getInput("token");

try {
  let pubspecHelper = new PubSpecHelper();

  const bumpType = new BumpHelper().getBumpType();
  const versionModel = pubspecHelper.readPubSpec();

  //console log the project name
  console.log("app_name: " + versionModel.appName);
  console.log("app_description:" + versionModel.appDescription);
  console.log("current_version_name: " + versionModel.version);
  console.log("current_build_number: " + versionModel.build);
  //output to github action
  core.setOutput("app_description", versionModel.appDescription);
  core.setOutput("app_name", versionModel.appName);
  core.setOutput("current_version_name", versionModel.version);
  core.setOutput("current_build_number", versionModel.build);

  let newVersion = VersionHelper.incrementVersion(versionModel, bumpType);
  console.log("new version:", versionModel.version);
  console.log("new build:", versionModel.build);
  core.setOutput("new_version_name", newVersion.version);
  core.setOutput("new_build_number", newVersion.build);

  //write to file pubspec.yaml
  pubspecHelper.writePubSpec(versionModel);
} catch (error) {
  console.error(error);
  core.setFailed("Action failed with error");
}
