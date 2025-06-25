const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body || '{}');

  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ reply: '⚠️ No prompt provided.' })
    };
  }

  const HF_API_KEY = process.env.HF_API_KEY;
  const model = "microsoft/phi-3-mini-4k-instruct";

  const systemPrompt = `You are a helpful chatbot for Dave's website, knowledgeable about DevOps, AI, and software development. Answer politely and professionally.\n\nUser: ${prompt}\nBot:`;

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
  let reply = '🤖 No response.';

  // Handle array or object response
  let generated = '';
  if (Array.isArray(data) && data[0]?.generated_text) {
    generated = data[0].generated_text;
  } else if (typeof data === 'object' && data.generated_text) {
    generated = data.generated_text;
  } else if (data.error) {
    generated = data.error;
  }

  if (generated) {
    // Try to extract after 'Bot:' if present
    const botIndex = generated.indexOf('Bot:');
    if (botIndex !== -1) {
      reply = generated.substring(botIndex + 4).trim();
    } else {
      reply = generated.trim();
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  };
};
