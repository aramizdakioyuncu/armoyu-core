import { SearchResult } from '../src/models/social/SearchResult';

const realSearchJson = {
  "#": 1,
  "ID": 11107,
  "Value": "Berkay Tikenoğlu",
  "turu": "oyuncu",
  "username": "berkaytikenoglu",
  "avatar": "https://example.com/avatar.jpg",
  "cins": "E"
};

function testSearchMapping() {
  console.log("Testing SearchResult.fromJSON with REAL API fields (Phase 4)...");
  const result = SearchResult.fromJSON(realSearchJson);
  
  console.log("ID:", result.id, result.id === 11107 ? "✅" : "❌");
  console.log("Title:", result.title, result.title === "Berkay Tikenoğlu" ? "✅" : "❌");
  console.log("Type:", result.type, result.type === "oyuncu" ? "✅" : "❌");
  console.log("Is Player:", result.isPlayer() ? "✅" : "❌");
}

testSearchMapping();
