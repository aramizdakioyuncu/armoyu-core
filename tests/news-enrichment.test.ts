import { News } from '../src/models/content/News';

const realNewsJson = {
  haberID: 1234,
  haberbaslik: "Test News Title",
  habericerik: "News Content summary...",
  goruntulen: 1500,
  zaman: "2 hours ago",
  yazar: "Admin",
  yazarid: 1,
  yazarmindakavatar: "https://example.com/avatar.jpg",
  haberresim: {
    media_URL: "https://example.com/image.jpg",
    media_minURL: "https://example.com/thumb.jpg"
  }
};

function testNewsMapping() {
  console.log("Testing News.fromJSON with REAL API fields (Phase 3)...");
  const news = News.fromJSON(realNewsJson);
  
  console.log("ID:", news.id, news.id === 1234 ? "✅" : "❌");
  console.log("Title:", news.title, news.title === "Test News Title" ? "✅" : "❌");
  console.log("Views:", news.views, news.views === 1500 ? "✅" : "❌");
  console.log("Author:", news.authorName, news.authorName === "Admin" ? "✅" : "❌");
}

testNewsMapping();
