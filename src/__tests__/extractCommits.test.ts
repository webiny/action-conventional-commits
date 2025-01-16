import { Context } from '@actions/github/lib/context'
import { extractCommits } from '../extractCommits'
import { describe, test, expect, jest, beforeEach } from '@jest/globals'

describe('extractCommits tests', () => {
  const getInput =
    (inputs: Record<string, string> = {}): ((input: string) => string) =>
    (input) =>
      inputs[input] ?? ''

  describe('Push commits', () => {
    test('should be able to extract commits from push', async () => {
      const context: Partial<Context> = {
        payload: {
          commits: [{ message: 'message0' }, { message: 'message1' }],
        },
      }
      const actualCommits = await extractCommits(context as Context, getInput())
      expect(actualCommits.length).toBe(2)
    })
  })

  describe('PR commits', () => {
    type ResponseFn = (input: string | URL | Request, init?: RequestInit | undefined) => Promise<Response>
    const responseFn = jest.fn<ResponseFn>()
    jest.spyOn(global, 'fetch').mockImplementation(responseFn)

    beforeEach(() => {
      responseFn.mockResolvedValue({ json: async () => [], ok: true } as Response)
    })

    const mockJsonResponse = (json: unknown) => {
      responseFn.mockResolvedValue({ json: async () => json, ok: true } as Response)
    }

    const fakePrNumber = 1347

    const commitsUrl = `https://api.example.com/repos/example/Hello-World/pulls/${fakePrNumber}/commits`
    const context: Partial<Context> = {
      payload: {
        pull_request: {
          number: fakePrNumber,
          commits_url: commitsUrl,
        },
      },
    }

    test('should be able to extract commits from PR', async () => {
      mockJsonResponse([
        { commit: { message: 'message0' } },
        { commit: { message: 'message1' } },
        { commit: { message: 'message2' } },
      ])

      const actualCommits = await extractCommits(context as Context, getInput())
      expect(actualCommits.length).toBe(3)
      expect(responseFn).toHaveBeenCalledWith(commitsUrl, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      })
    })

    test('should return empty array if no commits found', async () => {
      const actualCommits = await extractCommits(context as Context, getInput())
      expect(actualCommits.length).toBe(0)
      expect(responseFn).toHaveBeenCalledWith(commitsUrl, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      })
    })

    test('should add auth header if token is provided', async () => {
      mockJsonResponse([])

      const githubToken = 'ghp_1234567890abcdefghijklmnopqrstuvwxyz'
      await extractCommits(context as Context, getInput({ 'github-token': githubToken }))
      expect(responseFn).toHaveBeenCalledWith(commitsUrl, {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${githubToken}`,
        },
      })
    })
  })
})
