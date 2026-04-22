"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../shared/test-helper");
async function runLocationTest() {
    var _a;
    console.log('--- Location Service Test ---');
    const { api } = (0, test_helper_1.createTestApi)();
    try {
        const provincesResponse = await api.locations.getProvinces(1, 212, 10);
        (0, test_helper_1.logSuccess)(`Provinces fetched! Count: ${(_a = provincesResponse.icerik) === null || _a === void 0 ? void 0 : _a.length}`);
        if (provincesResponse.icerik && provincesResponse.icerik.length > 0) {
            console.log(`First Province: ${provincesResponse.icerik[0].name}`);
        }
    }
    catch (err) {
        (0, test_helper_1.logError)('Provinces fetch failed', err);
    }
}
runLocationTest();
