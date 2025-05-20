import isValidCommitMessage from "../isValidCommitMesage";

test("should be able to correctly validate the commit message", () => {
    expect(isValidCommitMessage("chore(nice-one): doing this right")).toBe(true);
    expect(isValidCommitMessage("feat!: change all the things")).toBe(true);
    expect(isValidCommitMessage("fix(user)!: a fix with some breaking changes")).toBe(true);
    expect(isValidCommitMessage("fix: menu must open on shortcut press")).toBe(true);
    expect(isValidCommitMessage("something: should not work")).toBe(false);
    expect(isValidCommitMessage("fixes something")).toBe(false);
    expect(isValidCommitMessage("🚧 fix: menu must open on shortcut press")).toBe(true);
    expect(isValidCommitMessage("fix(menus): menu must open on shortcut press")).toBe(true);
    expect(isValidCommitMessage("🚧 fix(menus): menu must open on shortcut press")).toBe(true);
    expect(isValidCommitMessage("🚧 fixing something")).toBe(false);
    expect(isValidCommitMessage("🚧 something: should not work")).toBe(false);
    expect(isValidCommitMessage("chorz: 123")).toBe(false);
});

test("should handle merge commits correctly", () => {
    expect(isValidCommitMessage("Merge we allow merge commits", undefined, true)).toBe(true);
    expect(isValidCommitMessage("Merge we don't allow merge commits", undefined, false)).toBe(false);
    expect(isValidCommitMessage("fix: we dont interfere with non-merge commits", undefined, true)).toBe(true);
    expect(isValidCommitMessage("fix: we dont interfere with non-merge commits", undefined, false)).toBe(true);
    expect(isValidCommitMessage("Merge we dont provide a value for merge commits")).toBe(true);
})
