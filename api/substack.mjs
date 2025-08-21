import Parser from "rss-parser";

export default async function handler(req, res) {
  try {
    const feedUrl = req.query.feed || "https://thisisrajpatil.substack.com/feed";
    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);

    const posts = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      excerpt: item.contentSnippet,
    }));

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feed", details: err.message });
  }
}
