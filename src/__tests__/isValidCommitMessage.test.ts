import isValidCommitMessage from "../isValidCommitMesage";

test("should be able to correctly validate the commit message", () => {
    expect(isValidCommitMessage("chore(nice-one): doing this right")).toBe(true);
    expect(isValidCommitMessage("feat!: change all the things")).toBe(true);
    expect(isValidCommitMessage("fix(user)!: a fix with some breaking changes")).toBe(true);
    expect(isValidCommitMessage("fix: menu must open on shortcut press")).toBe(true);
    expect(isValidCommitMessage("something: should not work")).toBe(false);
    expect(isValidCommitMessage("fixes something")).toBe(false);
    expect(isValidCommitMessage("🚧 fix: menu must open on shortcut press")).toBe(false);
    expect(isValidCommitMessage("fix(menus): menu must open on shortcut press")).toBe(true);
    expect(isValidCommitMessage("🚧 fix(menus): menu must open on shortcut press")).toBe(false);
    expect(isValidCommitMessage("🚧 fixing something")).toBe(false);
    expect(isValidCommitMessage("🚧 something: should not work")).toBe(false);
    expect(isValidCommitMessage("chorz: 123")).toBe(false);
    expect(isValidCommitMessage("(chorz:) 123")).toBe(false);
    expect(isValidCommitMessage("fix: test 🐛 with icon")).toBe(true);
    expect(isValidCommitMessage("fix:  test 🐛 with icon")).toBe(false);
    expect(isValidCommitMessage("fix: 🐛 test with icon")).toBe(true);
});
