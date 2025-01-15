import { context } from '@actions/github'
import { endGroup, getInput, info, setFailed, startGroup } from '@actions/core'

import isValidCommitMessage from './isValidCommitMesage'
import { extractCommits } from './extractCommits'

async function run() {
  info(`ℹ️ Checking if commit messages are following the Conventional Commits specification...`)

  const extractedCommits = await extractCommits(context, getInput)
  if (extractedCommits.length === 0) {
    info(`No commits to check, skipping...`)
    return
  }

  startGroup('Commit messages:')
  const allowedCommitTypes = getInput('allowed-commit-types').split(',')
  const commitMessageStatuses = extractedCommits.map<[string, boolean]>((commit) => [
    commit.message,
    isValidCommitMessage(commit.message, allowedCommitTypes),
  ])

  commitMessageStatuses.forEach(([message, isValid]) => {
    if (isValid) {
      info(`✅ ${message}`)
    } else {
      info(`🚩 ${message}`)
    }
  })
  endGroup()

  const hasErrors = commitMessageStatuses.some(([, isValid]) => !isValid)
  if (hasErrors) {
    setFailed(`🚫 According to the conventional-commits specification, some of the commit messages are not valid.`)
  } else {
    info('🎉 All commit messages are following the Conventional Commits specification.')
  }
}

run()
