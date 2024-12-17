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
        return pushCommits;
    }

    // For PRs, we need to get a list of commits via the GH API:
    const prCommitsUrl: string | undefined = context.payload.pull_request
        ?.commits_url;
    if (prCommitsUrl) {
        try {
            const githubToken = getInput("GITHUB_TOKEN");
            const requestHeaders: Record<string, string> = {
                "Accept": "application/vnd.github+json",
                ...(githubToken === ""
                    ? {}
                    : { "Authorization": `token ${githubToken}` }),
            };

            const { body } = await got.get(prCommitsUrl, {
                responseType: "json",
                headers: requestHeaders,
            });

            return Array.isArray(body) ? body.map((item) => item.commit) : [];
        } catch {
            return [];
        }
    }

    return [];
};
