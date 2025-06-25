const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body || '{}');

  const HF_API_KEY = process.env.HF_API_KEY;
  const model = "microsoft/phi-3-mini-4k-instruct";

  const systemPrompt = `You are a helpful chatbot.\n\nUser: ${prompt}\nBot:`;

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ inputs: systemPrompt })
    }
  );

  const data = await response.json();
  console.log("Raw Hugging Face response:", data);

  let reply = '';

  if (Array.isArray(data)) {
    reply = data?.[0]?.generated_text;
  } else if (data?.generated_text) {
    reply = data.generated_text;
  } else if (data?.error) {
    reply = `⚠️ API Error: ${data.error}`;
  } else {
    reply = '🤖 No response.';
  }

  if (reply && reply.includes('Bot:')) {
    reply = reply.split('Bot:').pop().trim();
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  };
};
