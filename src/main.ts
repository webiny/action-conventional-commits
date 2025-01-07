const { context } = require("@actions/github");
const core = require("@actions/core");

import isValidCommitMessage from "./isValidCommitMesage";
import extractCommits from "./extractCommits";

async function run() {
    const allowedCommitTypes = core.getInput("allowed-commit-types").split(",");
    const includePullRequestTitle = core.getBooleanInput("include-pull-request-title");

    let hasErrors = false;
    
    if (includePullRequestTitle) {
        core.info("ℹ️ Checking pull request title is following the Conventional Commits specification...");

        const pullRequestTitle = context.payload.pull_request.title;
        if (isValidCommitMessage(pullRequestTitle, allowedCommitTypes)) {
            core.info(`✅ ${pullRequestTitle}`);
        } else {
            core.info(`🚩 ${pullRequestTitle}`);
            hasErrors = true;
        }
    }

    core.info("ℹ️ Checking if commit messages are following the Conventional Commits specification...");

    const extractedCommits = await extractCommits(context, core);
    if (extractedCommits.length === 0) {
        core.info("No commits to check, skipping...");
        return;
    }

    core.startGroup("Commit messages:");

    for (let i = 0; i < extractedCommits.length; i++) {
        let commit = extractedCommits[i];
        if (isValidCommitMessage(commit.message, allowedCommitTypes)) {
            core.info(`✅ ${commit.message}`);
        } else {
            core.info(`🚩 ${commit.message}`);
            hasErrors = true;
        }
    }
    core.endGroup();

    if (hasErrors) {
        core.setFailed("🚫 According to the conventional-commits specification, some of the commit messages are not valid.");
    } else {
        core.info("🎉 All commit messages are following the Conventional Commits specification.");
    }
}

run();