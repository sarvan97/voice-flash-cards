import express from "express";
import "dotenv/config";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.static(__dirname));

app.get("/api/voice-token", async (_req, res) => {
  if (!process.env.ASSEMBLYAI_API_KEY) {
    return res.status(500).json({ error: "ASSEMBLYAI_API_KEY not set in .env" });
  }
  const url = new URL("https://agents.assemblyai.com/v1/token");
  url.searchParams.set("expires_in_seconds", "300");
  url.searchParams.set("max_session_duration_seconds", "1800");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.ASSEMBLYAI_API_KEY}` },
  });

  if (!response.ok) {
    return res.status(response.status).send(await response.text());
  }

  const { token } = await response.json();
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Flash Cards is at http://localhost:${PORT}/quiz.html`);
});
