const { context } = require("@actions/github");
const core = require("@actions/core");

const isValidCommitMessage = message => message.match(/^[a-z].*:/);

async function run() {
    core.info(
        `ℹ️ Checking if commit messages are following the Conventional Commits specification...`
    );

    console.log('context', JSON.stringify(context, null, 2));

    const hasCommits = context.payload && Array.isArray(context.payload.commits);
    if (!hasCommits) {
        core.info(`No commits to check, skipping...`);
        return;
    }

    let hasErrors;
    core.startGroup("Commit messages:");
    for (let i = 0; i < context.payload.commits.length; i++) {
        let commit = context.payload.commits[i];
        if (isValidCommitMessage(commit.message)) {
            core.info(`✅ ${commit.message}`);
        } else {
            core.info(`🚩 ${commit.message}`);
            hasErrors = true;
        }
    }
    core.endGroup();

    if (hasErrors) {
        core.setFailed(
            `🚫 According to the conventional-commits specification, some of the commit messages are not valid.`
        );
    } else {
        core.info("🎉 All commit messages are following the Conventional Commits specification.");
    }
}

run();
