import { ArmoyuEvent } from '../src/models/community/Event';

// Real API JSON captured from the events list response
const realEventJson = {
  "#": 1,
  "event_ID": 346,
  "event_status": 0,
  "event_name": "Okey Etkinliği",
  "event_gamename": "Okey",
  "event_gameID": 2561,
  "event_date": "30.05.2024 19:30",
  "event_participantlimit": 16,
  "event_participantcurrent": 14,
  "event_organizer": [
    {
      "player_ID": 1,
      "player_displayname": "Berkay Tikenoğlu",
      "player_avatar": "https://example.com/avatar.jpg"
    }
  ],
  "event_description": "Test description",
  "event_rules": "Test rules"
};

function testEventMapping() {
  console.log("Testing ArmoyuEvent.fromJSON with REAL API fields (Phase 5)...");
  
  const event = ArmoyuEvent.fromJSON(realEventJson);
  
  console.log("ID:", event.id, event.id === 346 ? "✅" : "❌");
  console.log("Name:", event.name, event.name === "Okey Etkinliği" ? "✅" : "❌");
  console.log("Game:", event.gameName, event.gameName === "Okey" ? "✅" : "❌");
  console.log("Date:", event.date, event.date === "30.05.2024 19:30" ? "✅" : "❌");
  console.log("Participants:", event.getParticipantProgress(), event.getParticipantProgress() === "14/16" ? "✅" : "❌");
  console.log("Organizer Count:", event.organizers.length, event.organizers.length === 1 ? "✅" : "❌");
  console.log("Organizer 1:", event.organizers[0].displayName, event.organizers[0].displayName === "Berkay Tikenoğlu" ? "✅" : "❌");
  console.log("Has Space:", event.hasSpace() ? "✅" : "❌");
}

testEventMapping();
