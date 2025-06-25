const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body || '{}');

  const HF_API_KEY = process.env.HF_API_KEY;
  const model = "microsoft/Phi-3-mini-4k-instruct";

  const response = await fetch(
    "https://api-inference.huggingface.co/v1/chat/completions",
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        model,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    }
  );

  const data = await response.json();
  console.log("Raw Hugging Face response:", data);

  let reply = '🤖 No response.';
  if (data.choices && data.choices[0]?.message?.content) {
    reply = data.choices[0].message.content.trim();
  } else if (data.error) {
    reply = `⚠️ API Error: ${data.error}`;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  };
};
