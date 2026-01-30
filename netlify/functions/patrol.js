export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
  if (!WEBHOOK_URL) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing webhook env var" }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Bad JSON" }) };
  }

  const username = String(body.username || "").trim();
  const rank = String(body.rank || "").trim();
  const type = String(body.type || "Start Patrol");
  const time = String(body.time || new Date().toISOString());

  if (!username || !rank) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing username or rank" }) };
  }

  const content =
`🛡️ **Patrol Log**
**Type:** ${type}
**User:** ${username}
**Rank:** ${rank}
**Time:** ${time}`;

  const resp = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });

  if (!resp.ok) {
    return { statusCode: 500, body: JSON.stringify({ error: "Discord webhook failed" }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
}
