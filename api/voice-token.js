export default async function handler(_req, res) {
  if (!process.env.ASSEMBLYAI_API_KEY) {
    return res.status(500).json({ error: "ASSEMBLYAI_API_KEY not set" });
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
  res.status(200).json({ token });
}
