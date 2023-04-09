import { VersionModel } from "./version.model";
import * as core from "@actions/core";

export class VersionHelper {
  public static incrementVersion(
    currentVersion: VersionModel,
    type: string
  ): VersionModel {
    let vs = { ...currentVersion };
    vs.build = `${parseInt(currentVersion.build) + 1}`;
    if (type === "major") {
      vs.version = `${parseInt(currentVersion.version.split(".")[0]) + 1}.0.0`;
    } else if (type === "minor") {
      vs.version = `${currentVersion.version.split(".")[0]}.${
        parseInt(currentVersion.version.split(".")[1]) + 1
      }.0`;
    } else {
      //by default is patch
      vs.version = `${currentVersion.version.split(".")[0]}.${
        currentVersion.version.split(".")[1]
      }.${parseInt(currentVersion.version.split(".")[2]) + 1}`;
    }

    return vs;
  }
}
