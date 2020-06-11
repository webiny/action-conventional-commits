const DEFAULT_COMMIT_TYPES = [
    "feat",
    "fix",
    "docs",
    "style",
    "refactor",
    "test",
    "build",
    "ci",
    "chore",
    "revert",
    "merge",
    "wip",
];

const isValidCommitMessage = (message, availableTypes = DEFAULT_COMMIT_TYPES): boolean => {
    let [possiblyValidCommitType] = message.split(":");
    possiblyValidCommitType = possiblyValidCommitType.toLowerCase();

    // Let's remove scope if present.
    if (possiblyValidCommitType.match(/\(\S*?\)/)) {
        possiblyValidCommitType = possiblyValidCommitType.replace(/\(\S*?\)/, "");
    }

    possiblyValidCommitType = possiblyValidCommitType
        .replace(/\s/g, "") // Remove all whitespace
        .replace(/()/g, "") // Remove all whitespace
        .replace(/[^a-z]/g, ""); // Only leave [a-z] characters.

    return availableTypes.includes(possiblyValidCommitType);
};

export default isValidCommitMessage;
