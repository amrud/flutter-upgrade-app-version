import * as core from "@actions/core";

export class BumpHelper {
  public getBumpType(): string {
    let targetBranch = core.getInput("target-branch");
    let minorWords = core.getInput("minor-wording")
      ? core.getInput("minor-wording").split(",")
      : [];
    let majorWords = core.getInput("major-wording")
      ? core.getInput("major-wording").split(",")
      : [];
    let patchWords = core.getInput("patch-wording")
      ? core.getInput("patch-wording").split(",")
      : [];
    const versionType = core.getInput("version-type"); //to bypass from commit message, if not set, will use commit message to determine version type
    let commitMessage = core.getInput("commit-message"); //to bypass from commit message, if not set, will use commit message to determine version type
    const tagPrefix = core.getInput("tag-prefix");
    const tagSuffix = core.getInput("tag-suffix");
    const bumpPolicy = core.getInput("bump-policy") || "all";
    let version = core.getInput("default") || "patch";
    let preid = core.getInput("preid") || "rc";

    const allowedTypes = ["major", "minor", "patch"];
    console.log("config words:", {
      majorWords,
      minorWords,
      patchWords,
    });

    const event = process.env.GITHUB_EVENT_PATH
      ? require(process.env.GITHUB_EVENT_PATH)
      : {};

    console.log("event:", event);
    console.log("versionType:", versionType);

    if (!event.commits && !versionType) {
      console.log(
        "Couldn't find any commits in this event, incrementing patch version..."
      );
    }

    if (
      process.env["INPUT_VERSION-TYPE"] &&
      !allowedTypes.includes(process.env["INPUT_VERSION-TYPE"])
    ) {
      throw new Error("Invalid version type");
    }

    const messages = event.commits
      ? event.commits.map((commit: any) => commit.message + "\n" + commit.body)
      : [];

    commitMessage = commitMessage || "ci: version bump to {{version}}";

    const commitMessageRegex = new RegExp(
      commitMessage.replace(
        /{{version}}/g,
        `${tagPrefix}\\d+\\.\\d+\\.\\d+${tagSuffix}`
      ),
      "ig"
    );

    let isVersionBump = false;
    if (bumpPolicy === "all") {
      isVersionBump =
        messages.find((message: any) => commitMessageRegex.test(message)) !==
        undefined;
    } else if (bumpPolicy === "last-commit") {
      isVersionBump =
        messages.length > 0 &&
        commitMessageRegex.test(messages[messages.length - 1]);
    } else if (bumpPolicy === "ignore") {
      console.log("Ignoring any version bumps in commits...");
    } else {
      console.warn(`Unknown bump policy: ${bumpPolicy}`);
    }

    if (isVersionBump) {
      throw new Error("No action necessary because we found a previous bump!");
    }

    // case if version-type found
    if (versionType) {
      version = versionType;
    }
    // case: if wording for MAJOR found
    else if (
      messages.some(
        (message: any) =>
          /^([a-zA-Z]+)(\(.+\))?(\!)\:/.test(message) ||
          majorWords.some((word: any) => message.includes(word))
      )
    ) {
      version = "major";
    }
    // case: if wording for MINOR found
    else if (
      messages.some((message: string) =>
        minorWords.some((word) => message.includes(word))
      )
    ) {
      version = "minor";
    }
    // case: if wording for PATCH found
    else if (
      patchWords &&
      messages.some((message: string) =>
        patchWords.some((word) => message.includes(word))
      )
    ) {
      version = "patch";
    }

    console.log("version action after first waterfall:", version);

    // case: if nothing of the above matches
    if (!version) {
      throw new Error("No version keywords found, skipping bump.");
    }

    return version;
  }

  public static commitAndPushChanges() {}
}
