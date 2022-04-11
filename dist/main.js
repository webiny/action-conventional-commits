var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// src/main.ts
var import_github2 = require("@actions/github");
var core = __toESM(require("@actions/core"));

// src/isValidCommitMessage.ts
var DEFAULT_COMMIT_TYPES = [
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "test",
  "build",
  "ci",
  "chore",
  "revert",
  "merge",
  "wip"
];
var isValidCommitMessage = (message, availableTypes = DEFAULT_COMMIT_TYPES) => {
  if (message.startsWith("Merge ") || message.startsWith("Revert "))
    return true;
  let [possiblyValidCommitType] = message.split(":");
  possiblyValidCommitType = possiblyValidCommitType.toLowerCase();
  if (possiblyValidCommitType.match(/\(\S*?\)/))
    possiblyValidCommitType = possiblyValidCommitType.replace(/\(\S*?\)/, "");
  possiblyValidCommitType = possiblyValidCommitType.replace(/\s/g, "").replace(/()/g, "").replace(/[^a-z]/g, "");
  return availableTypes.includes(possiblyValidCommitType);
};
var isValidCommitMessage_default = isValidCommitMessage;

// src/extractCommits.ts
var import_lodash = __toESM(require("lodash.get"));
var import_github = require("@actions/github");
var import_core = require("@actions/core");
var extractCommits = async (context2) => {
  const pushCommits = Array.isArray((0, import_lodash.default)(context2, "payload.commits"));
  if (pushCommits)
    return context2.payload.commits;
  const prNumber = (0, import_lodash.default)(context2, "payload.pull_request.number");
  if (prNumber) {
    try {
      const token = (0, import_core.getInput)("github-token");
      const github = new import_github.GitHub(token);
      const params = {
        owner: context2.repo.owner,
        repo: context2.repo.repo,
        pull_number: prNumber
      };
      const { data } = await github.pulls.listCommits(params);
      if (Array.isArray(data))
        return data.map((item) => item.commit);
      return [];
    } catch {
      return [];
    }
  }
  return [];
};
var extractCommits_default = extractCommits;

// src/extractPullRequest.ts
var extractPullRequest = async (context2) => {
  const { payload } = context2;
  const { pull_request: pullRequest } = payload;
  if (!pullRequest)
    throw new Error("No pull request found in the payload");
  const { title } = pullRequest;
  if (!title)
    throw new Error("No pull request title found in the payload");
  return title;
};

// src/main.ts
async function run() {
  if (core.getInput("check-pr-title") === "true") {
    const prTitle = await extractPullRequest(import_github2.context);
    if (!isValidCommitMessage_default(prTitle))
      core.setFailed("\u{1F6A9} PR title is not valid");
    else
      core.info("\u2705 PR title is valid");
  }
  core.info("\u2139\uFE0F Checking if commit messages are following the Conventional Commits specification...");
  const extractedCommits = await extractCommits_default(import_github2.context);
  if (extractedCommits.length === 0) {
    core.info("No commits to check, skipping...");
    return;
  }
  let hasErrors;
  core.startGroup("Commit messages:");
  for (let i = 0; i < extractedCommits.length; i++) {
    const commit = extractedCommits[i];
    if (isValidCommitMessage_default(commit.message)) {
      core.info(`\u2705 ${commit.message}`);
    } else {
      core.info(`\u{1F6A9} ${commit.message}`);
      hasErrors = true;
    }
  }
  core.endGroup();
  if (hasErrors) {
    core.setFailed("\u{1F6AB} According to the conventional-commits specification, some of the commit messages are not valid.");
  } else {
    core.info("\u{1F389} All commit messages are following the Conventional Commits specification.");
  }
}
run();
