import { Context } from "@actions/github/lib/context";
import { extractCommits } from "../extractCommits";

describe("extractCommits tests", () => {
    describe("PR commits", () => {
        test("should be able to extract commits from push", async () => {
            const context: Partial<Context> = {
                payload: {
                    commits: [
                        { message: "message0" },
                        { message: "message1" },
                    ],
                },
            };
            const test = await extractCommits(
                context as Context,
                (input) => input,
            );
            expect(test.length).toBe(2);
        });
    });

    describe("push commits", () => {
        test("should be able to extract commits from PR", async () => {
            const commitsUrl =
                "https://api.github.com/repos/octocat/Hello-World/pulls/1347/commits";
            jest.spyOn(global, "fetch").mockImplementation(
                jest.fn(
                    () =>
                        Promise.resolve({
                            json: () =>
                                Promise.resolve([
                                    { commit: { message: "message0" } },
                                    { commit: { message: "message1" } },
                                    { commit: { message: "message2" } },
                                ]),
                        }),
                ) as jest.Mock,
            );
            const fakePrNumber = 1347;
            const context: Partial<Context> = {
                payload: {
                    pull_request: {
                        number: fakePrNumber,
                        commits_url: commitsUrl,
                    },
                },
            };
            const test = await extractCommits(
                context as Context,
                (input) => input,
            );
            expect(test.length).toBe(3);
        });
    });
});
