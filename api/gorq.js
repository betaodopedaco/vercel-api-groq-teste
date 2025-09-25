import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // Pega o prompt enviado pelo cliente ou usa um padrão
    const { prompt } = req.body || { prompt: "Olá, Gorq!" };

    // Faz a requisição para a API Gorq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, // chave segura via variável de ambiente
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-oss", // ou outro modelo que você tenha acesso
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    // Retorna a resposta da API Gorq
    res.status(200).json(data);
  } catch (error) {
    console.error("Erro na API Gorq:", error);
    res.status(500).json({ error: "Erro interno na API Gorq" });
  }
}
