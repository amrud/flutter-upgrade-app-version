import * as core from "@actions/core";
import { PubSpecHelper } from "./pubspec.helper";
import { VersionHelper } from "./version.helper";
import { BumpHelper } from "./bump.helper";

let directory = core.getInput("directory");
const token = core.getInput("token");

try {
  const filename = "pubspec.yaml";
  if (!directory) {
    directory = "";
  } else {
    directory = directory + "/";
  }

  // const allowedTypes = ["major", "minor", "patch"];
  // console.log("config words:", {
  //   majorWords,
  //   minorWords,
  //   patchWords,
  // });

  //read from file pubspec.yaml and get the name of the project
  //use readPubSpec from read-pubspec.ts

  const bumpType = new BumpHelper().getBumpType();

  const path = `${directory}${filename}`;
  const versionModel = PubSpecHelper.readPubSpec(path);
  console.log("build:", versionModel.build);
  console.log("version:", versionModel.version);
  VersionHelper.incrementVersion(versionModel, bumpType);
  console.log("new version:", versionModel.version);
  console.log("new build:", versionModel.build);

  //write to file pubspec.yaml
  PubSpecHelper.writePubSpec(path, versionModel);
} catch (error) {
  console.error(error);
  core.setFailed("Action failed with error");
}
