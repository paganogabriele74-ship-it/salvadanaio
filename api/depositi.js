const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function requiredEnv(res) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    res.writeHead(500, headers);
    res.end(JSON.stringify({ error: "Cloud sync non configurato" }));
    return null;
  }
  return { url, key, space: process.env.SYNC_SPACE_ID || "gabri-rossi-vacanza" };
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

async function supabaseFetch(env, path, options = {}) {
  const response = await fetch(`${env.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Errore Supabase");
  }
  return data;
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  const env = requiredEnv(res);
  if (!env) return;

  try {
    if (req.method === "GET") {
      const data = await supabaseFetch(
        env,
        `depositi?space_id=eq.${encodeURIComponent(env.space)}&select=id,person,amount,note,date,created_at&order=created_at.asc`
      );
      res.writeHead(200, headers);
      res.end(JSON.stringify(data));
      return;
    }

    if (req.method === "POST") {
      const body = await readBody(req);
      const payload = {
        id: body.id,
        space_id: env.space,
        person: body.person,
        amount: Number(body.amount),
        note: body.note || "",
        date: body.date || ""
      };
      const data = await supabaseFetch(env, "depositi", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      res.writeHead(200, headers);
      res.end(JSON.stringify(data[0]));
      return;
    }

    if (req.method === "PUT") {
      const body = await readBody(req);
      const payload = {
        person: body.person,
        amount: Number(body.amount),
        note: body.note || "",
        date: body.date || ""
      };
      const data = await supabaseFetch(
        env,
        `depositi?id=eq.${encodeURIComponent(body.id)}&space_id=eq.${encodeURIComponent(env.space)}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload)
        }
      );
      res.writeHead(200, headers);
      res.end(JSON.stringify(data[0]));
      return;
    }

    if (req.method === "DELETE") {
      const id = new URL(req.url, "http://localhost").searchParams.get("id");
      await supabaseFetch(
        env,
        `depositi?id=eq.${encodeURIComponent(id)}&space_id=eq.${encodeURIComponent(env.space)}`,
        { method: "DELETE" }
      );
      res.writeHead(200, headers);
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.writeHead(405, headers);
    res.end(JSON.stringify({ error: "Metodo non supportato" }));
  } catch (error) {
    res.writeHead(500, headers);
    res.end(JSON.stringify({ error: error.message }));
  }
};
