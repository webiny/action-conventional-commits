import get from 'lodash.get'
import { GitHub } from '@actions/github'
import { getInput } from '@actions/core'
import type { Context } from '@actions/github/lib/context'

interface Commit {
    message: string
}

const extractCommits = async(context: Context): Promise<Commit[]> => {
    // For "push" events, commits can be found in the "context.payload.commits".
    const pushCommits = Array.isArray(get(context, 'payload.commits'))
    if (pushCommits)
        return context.payload.commits

    // For PRs, we need to get a list of commits via the GH API:
    const prNumber = get(context, 'payload.pull_request.number')
    if (prNumber) {
        try {
            const token = getInput('github-token')
            const github = new GitHub(token)

            const params = {
                owner: context.repo.owner,
                repo: context.repo.repo,
                pull_number: prNumber,
            }
            const { data } = await github.pulls.listCommits(params)

            if (Array.isArray(data))
                return data.map(item => item.commit)

            return []
        }
        catch {
            return []
        }
    }

    return []
}

export default extractCommits
