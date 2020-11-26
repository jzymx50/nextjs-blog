const execSync = require("child_process").execSync;

const lastCommitCommand = "git rev-parse HEAD";

module.exports = {
    async generateBuildId() {
        return execSync(lastCommitCommand).toString().trim();
    },
};