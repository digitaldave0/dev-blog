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
  console.log("Raw response from Hugging Face:", data);

  let reply;
  if (Array.isArray(data)) {
    reply = data[0]?.generated_text || '🤖 No response.';
    // Remove the system prompt and user input from the response
    const userPromptIndex = reply.indexOf('User:');
    if (userPromptIndex !== -1) {
      reply = reply.substring(reply.indexOf('Bot:') + 4).trim();
    }
  } else {
    reply = data?.generated_text || data?.error || '🤖 No response.';
  }

  console.log("Processed reply:", reply);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  };
};
