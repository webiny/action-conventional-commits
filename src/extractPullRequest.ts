import type { Context } from '@actions/github/lib/context'

export const extractPullRequest = async(context: Context): Promise<string> => {
    const { payload } = context
    const { pull_request: pullRequest } = payload
    if (!pullRequest)
        throw new Error('No pull request found in the payload')

    const { title } = pullRequest
    if (!title)
        throw new Error('No pull request title found in the payload')

    return title
}
