import { VersionModel } from "./version.model";
import * as core from "@actions/core";

export class VersionHelper {
  public static incrementVersion(
    currentVersion: VersionModel,
    type: string
  ): VersionModel {
    if (type === "major") {
      currentVersion.version = `${
        parseInt(currentVersion.version.split(".")[0]) + 1
      }.0.0`;
    } else if (type === "minor") {
      currentVersion.version = `${currentVersion.version.split(".")[0]}.${
        parseInt(currentVersion.version.split(".")[1]) + 1
      }.0`;
    } else {
      //by default is patch
      currentVersion.version = `${currentVersion.version.split(".")[0]}.${
        currentVersion.version.split(".")[1]
      }.${parseInt(currentVersion.version.split(".")[2]) + 1}`;
    }

    currentVersion.build = `${parseInt(currentVersion.build) + 1}`;

    core.setOutput("new_version_name", currentVersion.version);
    core.setOutput("new_build_number", currentVersion.build);

    return currentVersion;
  }
}
