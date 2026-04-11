import { User } from '../src/models/auth/User';

// Simulation of raw API JSON
const realUserJson = {
  playerID: 11107,
  username: "deneme",
  firstName: "Test",
  lastName: "Kullanıcı",
  ODP: "33.33",
  level: 51,
  detailInfo: {
    age: 24,
    country: { country_name: "TÜRKİYE" },
    province: { province_name: "ORDU" }
  },
  popularGames: [
    { game_name: "Minecraft", game_ID: 1628 }
  ]
};

function testUserMapping() {
  console.log("Testing User.fromJSON with REAL API fields (Phase 2)...");
  const user = User.fromJSON(realUserJson);
  
  console.log("Username:", user.username, user.username === "deneme" ? "✅" : "❌");
  console.log("First Name:", user.firstName, user.firstName === "Test" ? "✅" : "❌");
  console.log("Rating (ODP):", user.rating, user.rating === 33.33 ? "✅" : "❌");
  console.log("Age:", user.age, user.age === 24 ? "✅" : "❌");
  console.log("Game Count:", user.popularGames.length, user.popularGames.length === 1 ? "✅" : "❌");
}

testUserMapping();
