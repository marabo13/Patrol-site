exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  // 🔴 THIS IS READ FROM NETLIFY (YOU DO NOT EDIT THIS)
  const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing DISCORD_WEBHOOK_URL env var" })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" })
    };
  }

  const username = body.username || "Unknown";
  const rank = body.rank || "Unknown";
  const action = body.action || "Start Patrol";
  const time = body.time || new Date().toISOString();

  // 🟢 THIS IS THE DISCORD MESSAGE FORMAT
  const content =
`🛡️ **Patrol Log**
**Action:** ${action}
**User:** ${username}
**Rank:** ${rank}
**Time:** ${time}`;

  const resp = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });

  if (!resp.ok) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Discord webhook failed" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
