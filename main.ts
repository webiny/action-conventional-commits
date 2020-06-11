import { Contreebutors } from "contreebutors";
const { GitHub, context } = require('@actions/github');

(async () => {
    const core = require("@actions/core");
    const exec = require("@actions/exec");

    // 1. Extract a list of users from received commits.
    const token = process.env.GH_TOKEN;

    const client = new GitHub(token, {});
    const result = await client.repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: context.sha,
    });

    const pr = result.data.length > 0 && result.data[0];

    core.setOutput('pr', pr && pr.number || '');
    core.setOutput('number', pr && pr.number || '');
    core.setOutput('title', pr && pr.title || '');
    core.setOutput('body', pr && pr.body || '');


    // 2. Add them to the list.
    const contreebutors = new Contreebutors();

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        await contreebutors.add(user);
    }

    // 3. Commit changes done on the `contreebutors.json` and `README.md` file.

    // 4. Add comment to the merged PR - notify the user that he was added to the contributors list.

})();
