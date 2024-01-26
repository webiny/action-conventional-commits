import get from "lodash.get";
import got from "got";

type Commit = {
    message: string;
};

const extractCommits = async (context, core): Promise<Commit[]> => {

    core.debug(`context.payload.commits: ${JSON.stringify(context.payload.commits, null, 2)}\n`);
    core.debug(`context.payload.pull_request: ${JSON.stringify(context.payload.pull_request, null, 2)}\n`);

    // For "push" events, commits can be found in the "context.payload.commits".
    const pushCommits = Array.isArray(get(context, "payload.commits"));
    if (pushCommits) {
        core.info(`detected a "push"; using those commits`);
        return context.payload.commits;
    }

    const pull_request = get(context, "payload.pull_request");
    if (!pull_request) {
        core.warnMsg("Push or Pull Request not detected; no commits to check"); 
    }   else {
        core.info(`detected a "pull request"; using those commits`);

        const prCommitsUrl = get(pull_request, "commits_url");
        if (prCommitsUrl) {
            try {
                let requestHeaders = {
                    "Accept": "application/vnd.github+json",
                }
                if (core.getInput('GITHUB_TOKEN') != "") {
                    requestHeaders["Authorization"] = "token " + core.getInput('GITHUB_TOKEN')
                } 
                const { body } = await got.get(prCommitsUrl, {
                    responseType: "json",
                    headers: requestHeaders,
                });

                core.debug(`body extracted: ${JSON.stringify(body)}`);
                core.info(`Commits extracted: ${(body as any)?.length}`);

                if (Array.isArray(body)) {
                    return body.map((item) => item.commit);
                }
                return [];
            } catch (err) {
                const msg = (err as any)?.message || err;
                core.warnMsg(`Issue processing prCommitsUrl: ${msg}; no commits to check`); 
                return [];
            }
        } else {
            core.warnMsg("missing prCommitsUrl; no commits to check"); 
        }
    }

    return [];
};

export default extractCommits;
