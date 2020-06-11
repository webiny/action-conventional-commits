const { context } = require("@actions/github");
const core = require("@actions/core");
const get = require("lodash.get");
const got = require("got");

type Commit = {
    message: string;
};

const isValidCommitMessage = (message): boolean => message.match(/^[a-z].*:/);

const extractCommits = async (): Promise<Commit[]> => {
    // For "push" events, commits can be found in the "context.payload.commits".
    const pushCommits = Array.isArray(get(context, "payload.commits"));
    if (pushCommits) {
        return context.payload.commits;
    }

    // For PRs, we need to get a list of commits via the GH API:
    const prCommitsUrl = get(context, "payload.pull_request.commits_url");
    console.log('ide check URL-a')
    console.log('dobeoo PR URL', prCommitsUrl)
    console.log(context.payload)
    if (prCommitsUrl) {
        try {
            const { body } = await got.get(prCommitsUrl, {
                responseType: "json",
            });

            console.log('dobeo vodyyyy', body)
            if (Array.isArray(body)) {
                return body.map((item) => item.commit);
            }
            return [];
        } catch {
            return [];
        }
    }

    return [];
};

async function run() {
    core.info(
        `ℹ️ Checking if commit messages are following the Conventional Commits specification...`
    );

    const extractedCommits = await extractCommits();
    if (extractedCommits.length === 0) {
        core.info(`No commits to check, skipping...`);
        return;
    }

    let hasErrors;
    core.startGroup("Commit messages:");
    for (let i = 0; i < extractedCommits.length; i++) {
        let commit = extractedCommits[i];
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
