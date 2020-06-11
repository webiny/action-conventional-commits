const { context } = require("@actions/github");
const core = require("@actions/core");

const isValidCommitMessage = message => message.match(/^[a-z].*:/);

async function run() {
    core.info(
        `ℹ️ Checking if commit messages are following the Conventional Commits specification...`
    );

    const hasCommits = context.payload && Array.isArray(context.payload.commits);
    if (!hasCommits) {
        core.info(`No commits to check, skipping...`);
        return;
    }

    for (let i = 0; i < context.payload.commits.length; i++) {
        let commit = context.payload.commits[i];
        if (!isValidCommitMessage(commit.message)) {
            core.setFailed(
                `According to the conventional-commits specification, commit message ${commit.message} is not valid.`
            );
        }
    }

    core.info("🎉 All commit messages are following the Conventional Commits specification.");
}

run();
