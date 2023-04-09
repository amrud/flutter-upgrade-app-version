import * as core from "@actions/core";

let directory = core.getInput("directory");
const token = core.getInput("token");

const filename = "pubspec.yaml";
if (!directory) {
  directory = "";
} else {
  directory = directory + "/";
}

const path = `${directory}${filename}`;

console.log("hello world");
