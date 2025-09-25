// api/gorq.js
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  // CORS simples para permitir chamadas do public/index.html
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      res.status(500).json({ error: "GROQ_API_KEY não configurada no ambiente." });
      return;
    }

    // Suporta GET (teste rápido) e POST (recomendado)
    if (req.method === "GET") {
      res.status(200).json({ message: "Endpoint Gorq pronto. Envie POST com JSON { prompt }" });
      return;
    }

    // Para POST: pega o prompt do body
    const body = req.body || {};
    // Se Vercel parseou o body já, body.prompt existe; se não, tenta parse manualmente
    const prompt = body.prompt || (typeof req.body === "string" ? JSON.parse(req.body).prompt : undefined) || "Olá, Gorq!";

    // Monta a requisição para o Groq
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-oss",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await groqRes.json();

    // Retorna direto o JSON do Groq (ou adapte conforme precisar)
    res.status(200).json(data);
  } catch (err) {
    console.error("Erro na API Gorq:", err);
    res.status(500).json({ error: "Erro interno na API Gorq", details: err.message || err });
  }
};
