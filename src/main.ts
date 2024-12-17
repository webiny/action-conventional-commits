import { context } from "@actions/github";
import { endGroup, getInput, info, setFailed, startGroup } from "@actions/core";

import isValidCommitMessage from "./isValidCommitMesage";
import { extractCommits } from "./extractCommits";

async function run() {
    info(
        `ℹ️ Checking if commit messages are following the Conventional Commits specification...`,
    );

    const extractedCommits = await extractCommits(context, getInput);
    if (extractedCommits.length === 0) {
        info(`No commits to check, skipping...`);
        return;
    }

    let hasErrors;
    startGroup("Commit messages:");
    for (let i = 0; i < extractedCommits.length; i++) {
        let commit = extractedCommits[i];

        const allowedCommitTypes = getInput("allowed-commit-types").split(
            ",",
        );

        if (isValidCommitMessage(commit.message, allowedCommitTypes)) {
            info(`✅ ${commit.message}`);
        } else {
            info(`🚩 ${commit.message}`);
            hasErrors = true;
        }
    }
    endGroup();

    if (hasErrors) {
        setFailed(
            `🚫 According to the conventional-commits specification, some of the commit messages are not valid.`,
        );
    } else {
        info(
            "🎉 All commit messages are following the Conventional Commits specification.",
        );
    }
}

run();
