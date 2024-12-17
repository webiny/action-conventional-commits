import got from "got";
import { Context } from "@actions/github/lib/context";

export type Commit = {
    message: string;
};

export const extractCommits = async (
    context: Context,
    getInput: (input: string) => string,
): Promise<Commit[]> => {
    // For "push" events, commits can be found in the "context.payload.commits".
    const pushCommits = context.payload.commits;
    if (Array.isArray(pushCommits)) {
        assertCommitArray(pushCommits);
        return pushCommits;
    }
    const commits_url = context.payload.pull_request?.commits_url;
    if (typeof commits_url !== "string") {
        return [];
    }
    const githubToken = getInput("github-token");
    return getPrCommits({ prCommitsUrl: commits_url, githubToken });
};

interface GetPrCommitsProps {
    prCommitsUrl: string;
    githubToken: string;
}
async function getPrCommits(
    { prCommitsUrl, githubToken }: GetPrCommitsProps,
): Promise<Commit[]> {
    // For PRs, we need to get a list of commits via the GH API:
    const requestHeaders: Record<string, string> = {
        "Accept": "application/vnd.github+json",
        ...(githubToken === ""
            ? {}
            : { "Authorization": `token ${githubToken}` }),
    };

    try {
        const { body } = await got.get(prCommitsUrl, {
            responseType: "json",
            headers: requestHeaders,
        });
        if (!Array.isArray(body)) {
            return [];
        }

        const commits = body.map((item) => {
            return item?.commit;
        });
        assertCommitArray(commits);
        return commits;
    } catch {
        return [];
    }
}

function assertCommitArray(commits: unknown[]): asserts commits is Commit[] {
    commits.forEach(assertIsCommit);
    function assertIsCommit(item: unknown): asserts item is Commit {
        if (
            typeof item !== "object" || item === null || !("message" in item) ||
            typeof item.message !== "string"
        ) {
            throw new Error("Commit message is not a string.");
        }
    }
}
