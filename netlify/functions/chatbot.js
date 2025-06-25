const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body || '{}');

  const HF_API_KEY = process.env.HF_API_KEY;
  const model = "HuggingFaceH4/zephyr-7b-alpha";

  // Classic prompt for instruct/chat models
  const systemPrompt = `You are a helpful chatbot.\n\nUser: ${prompt}\nBot:`;

  let reply = '🤖 No response.';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000); // 9s timeout for Netlify free tier
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ inputs: systemPrompt }),
        signal: controller.signal
      }
    );
    clearTimeout(timeout);
    if (response.status === 404) {
      reply = '⚠️ Model not found or unavailable on free tier.';
    } else {
      const data = await response.json();
      console.log("Raw Hugging Face response:", data);
      if (Array.isArray(data) && data[0]?.generated_text) {
        reply = data[0].generated_text;
      } else if (data.generated_text) {
        reply = data.generated_text;
      } else if (data.error) {
        reply = `⚠️ API Error: ${data.error}`;
      }
      // Try to extract after 'Bot:' if present
      if (reply && reply.includes('Bot:')) {
        reply = reply.split('Bot:').pop().trim();
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      reply = '⚠️ Model is loading or slow. Please try again in a few seconds.';
    } else {
      reply = `⚠️ Error: ${err.message}`;
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  };
};
