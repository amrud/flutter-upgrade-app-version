import { VersionModel } from "./version.model";
import * as core from "@actions/core";

export class PubSpecHelper {
  public static writePubSpec(path: string, newVersion: VersionModel) {
    const fs = require("fs");
    //replace the version in pubspec.yaml
    const pubspec = fs.readFileSync(path, "utf8");
    const pubspecLines = pubspec.split("\n");

    let versionLine = pubspecLines.find((line: string) =>
      line.startsWith("version")
    );

    if (versionLine) {
      let newVersionLine = `version: ${newVersion.version}+${newVersion.build}`;
      pubspecLines[pubspecLines.indexOf(versionLine)] = newVersionLine;

      //write back to file
      fs.writeFileSync(path, pubspecLines.join("\n"), "utf8");
    }
  }

  public static readPubSpec(path: string): VersionModel {
    const fs = require("fs");
    console.log(">> pubspec.yaml directory: " + path);

    //check if pubspec.yaml exists
    if (!fs.existsSync(path)) {
      console.log(">> pubspec.yaml not found");
      throw new Error("pubspec.yaml not found");
    }

    console.log(">> pubspec.yaml exist");
    const pubspec = fs.readFileSync(path, "utf8");
    const pubspecLines = pubspec.split("\n");
    const appName = pubspecLines[0].split(":")[1].trim();
    const appDescription = pubspecLines[1].split(":")[1].trim();

    //console log the project name
    console.log("app_name: " + appName);
    console.log("app_description:" + appDescription);
    core.setOutput("project_name", appName);
    core.setOutput("app_description", appDescription);

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

      console.log("current_version_name: " + versionName);
      console.log("current_build_number: " + buildNumber);
      //output to github action
      core.setOutput("current_version_name", versionName);
      core.setOutput("current_build_number", buildNumber);

      //increase the version
      const versionModel = new VersionModel();
      versionModel.version = versionName;
      versionModel.build = buildNumber;
      return versionModel;
    }

    throw new Error("Version not found");
  }
}
