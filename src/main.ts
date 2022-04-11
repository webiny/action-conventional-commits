import { context } from '@actions/github'
import * as core from '@actions/core'

import isValidCommitMessage from './isValidCommitMessage'
import extractCommits from './extractCommits'
import { extractPullRequest } from './extractPullRequest'

async function run() {
    if (core.getInput('check-pr-title') === 'true') {
        const prTitle = await extractPullRequest(context)
        if (!isValidCommitMessage(prTitle))
            core.setFailed('🚩 PR title is not valid')
        else
            core.info('✅ PR title is valid')
    }

    core.info(
        'ℹ️ Checking if commit messages are following the Conventional Commits specification...',
    )

    const extractedCommits = await extractCommits(context)
    if (extractedCommits.length === 0) {
        core.info('No commits to check, skipping...')
        return
    }

    let hasErrors
    core.startGroup('Commit messages:')
    for (let i = 0; i < extractedCommits.length; i++) {
        const commit = extractedCommits[i]
        if (isValidCommitMessage(commit.message)) {
            core.info(`✅ ${commit.message}`)
        }
        else {
            core.info(`🚩 ${commit.message}`)
            hasErrors = true
        }
    }
    core.endGroup()

    if (hasErrors) {
        core.setFailed(
            '🚫 According to the conventional-commits specification, some of the commit messages are not valid.',
        )
    }
    else { core.info('🎉 All commit messages are following the Conventional Commits specification.') }
}

run()
