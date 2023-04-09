import { VersionModel } from "./version.model";
import * as core from "@actions/core";

export class PubSpecHelper {
  path: string;

  constructor() {
    let directory = core.getInput("directory");
    const filename = "pubspec.yaml";
    if (!directory) {
      directory = "";
    } else {
      directory = directory + "/";
    }
    this.path = `${directory}${filename}`;
    console.log(">> pubspec.yaml directory: " + this.path);
  }

  public writePubSpec(newVersion: VersionModel) {
    const fs = require("fs");
    //replace the version in pubspec.yaml
    const pubspec = fs.readFileSync(this.path, "utf8");
    const pubspecLines = pubspec.split("\n");

    let versionLine = pubspecLines.find((line: string) =>
      line.startsWith("version")
    );

    if (versionLine) {
      let newVersionLine = `version: ${newVersion.version}+${newVersion.build}`;
      pubspecLines[pubspecLines.indexOf(versionLine)] = newVersionLine;

      //write back to file
      fs.writeFileSync(this.path, pubspecLines.join("\n"), "utf8");
    }
  }

  public readPubSpec(): VersionModel {
    const fs = require("fs");

    //check if pubspec.yaml exists
    if (!fs.existsSync(this.path)) {
      console.log(">> pubspec.yaml not found");
      throw new Error("pubspec.yaml not found");
    }

    console.log(">> pubspec.yaml exist");
    const pubspec = fs.readFileSync(this.path, "utf8");
    const pubspecLines = pubspec.split("\n");
    const appName = pubspecLines[0].split(":")[1].trim();
    const appDescription = pubspecLines[1].split(":")[1].trim();

    //get the version
    //filter pubspeclines by starts with version
    let versionLine = pubspecLines.find((line: string) =>
      line.startsWith("version")
    );

    if (versionLine) {
      console.log(versionLine);
      versionLine = versionLine.replace("version:", "").trim();
      //get build number
      //get versionname
      const versionName = versionLine.split("+")[0];
      const buildNumber = versionLine.split("+")[1];

      //increase the version
      const versionModel = new VersionModel();
      versionModel.version = versionName;
      versionModel.build = buildNumber;
      versionModel.appName = appName;
      versionModel.appDescription = appDescription;
      return versionModel;
    }

    throw new Error("Version not found");
  }
}
