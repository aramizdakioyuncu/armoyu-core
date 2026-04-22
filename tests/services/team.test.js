"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runTeamTest() {
    var _a;
    console.log('--- Team Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    try {
        const teamsResponse = await api.teams.getTeams();
        (0, test_helper_1.logSuccess)(`Teams fetched! Count: ${(_a = teamsResponse.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
        if (teamsResponse.icerik && teamsResponse.icerik.length > 0) {
            console.log(`First Team: ${teamsResponse.icerik[0].name}`);
        }
    }
    catch (err) {
        (0, test_helper_1.logError)('Teams fetch failed', err);
    }
}
runTeamTest();
