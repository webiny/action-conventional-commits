import isValidCommitMessage from '../isValidCommitMesage'
import { describe, test, expect } from '@jest/globals'

describe('isValidCommitMessage tests', () => {
  describe('should be able to correctly validate the commit message', () => {
    test.each<[string, boolean]>([
      ['chore(nice-one): doing this right', true],
      ['feat!: change all the things', true],
      ['fix(user)!: a fix with some breaking changes', true],
      ['fix: menu must open on shortcut press', true],
      ['something: should not work', false],
      ['fixes something', false],
      ['🚧 fix: menu must open on shortcut press', true],
      ['fix(menus): menu must open on shortcut press', true],
      ['🚧 fix(menus): menu must open on shortcut press', true],
      ['🚧 fixing something', false],
      ['🚧 something: should not work', false],
      ['chorz: 123', false],
      ["Merge branch 'master' into feature/branch", true],
      ["Revert 'fix: menu must open on shortcut press'", true],
      ['f1i1234567890x3: menu must open on shortcut press', false],
    ])('%s', (msg, expected) => {
      expect(isValidCommitMessage(msg)).toBe(expected)
    })
  })

  describe("should handle the 'availableTypes' parameter correctly", () => {
    test.each<[string, string[], boolean]>([
      ['chore(nice-one): doing this right', ['chore', 'fix'], true],
      ['feat!: change all the things', ['chore', 'fix'], false],
      ['fix(user)!: a fix with some breaking changes', ['chore', 'feat'], false],
      ['fix: menu must open on shortcut press', ['chore', 'fix'], true],
      ['something: should not work', ['chore', 'fix'], false],
      ['fixes something', ['chore', 'fix'], false],
      ['🚧 fix: menu must open on shortcut press', ['chore', 'fix'], true],
      ['fix(menus): menu must open on shortcut press', ['chore', 'fix'], true],
      ['🚧 fix(menus): menu must open on shortcut press', ['chore', 'fix'], true],
      ['🚧 fixing something', ['chore', 'fix'], false],
      ['🚧 something: should not work', ['chore', 'fix'], false],
      ['chorz: 123', ['chore', 'fix'], false],
      ["Merge branch 'master' into feature/branch", ['chore', 'fix'], true],
      ["Revert 'fix: menu must open on shortcut press'", ['chore', 'fix'], true],
      ['f1i2x3: menu must open on shortcut press', ['chore', 'fix'], false],
    ])('%s', (msg, availableTypes, expected) => {
      expect(isValidCommitMessage(msg, availableTypes)).toBe(expected)
    })
  })
})
