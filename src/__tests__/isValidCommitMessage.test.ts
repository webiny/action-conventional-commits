import isValidCommitMessage from "../isValidCommitMesage";

describe("isValidCommitMessage tests", () => {
    describe("shoulde be able to correctly validate the commit message", () => {
        test.each<[string, boolean]>([
            ["chore(nice-one): doing this right", true],
            ["feat!: change all the things", true],
            ["fix(user)!: a fix with some breaking changes", true],
            ["fix: menu must open on shortcut press", true],
            ["something: should not work", false],
            ["fixes something", false],
            ["🚧 fix: menu must open on shortcut press", true],
            ["fix(menus): menu must open on shortcut press", true],
            ["🚧 fix(menus): menu must open on shortcut press", true],
            ["🚧 fixing something", false],
            ["🚧 something: should not work", false],
            ["chorz: 123", false],
        ])(
            "%s",
            (msg, expected) => {
                expect(isValidCommitMessage(msg)).toBe(expected);
            },
        );
    });
});
