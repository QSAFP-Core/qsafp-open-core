'use strict';
const crypto = require('node:crypto');

const now = () => Number(process.hrtime.bigint()) / 1e6;

async function runGrok1Timed(opts = {}) {
  const {
    apiKey = process.env.GROK_API_KEY,
    endpoint = process.env.GROK_API_URL || 'https://api.x.ai/v1/chat/completions',
    model = process.env.GROK_MODEL || 'grok-2-latest',
    prompt,
    stream = true,
    max_tokens = 256,
    temperature = 0.2,
    metadata = {},
  } = opts;

  if (!apiKey) throw new Error('Missing GROK_API_KEY');

  const prompt_hash = crypto.createHash('sha256').update(prompt || '').digest('hex').slice(0, 16);

  const t0 = now();
  const body = { model, messages: [{ role: 'user', content: prompt }], max_tokens, temperature, stream };

  const t1 = now();
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const t2 = now();

  if (!res.ok) {
    const errTxt = await res.text().catch(() => '');
    throw new Error(`Grok1 HTTP ${res.status}: ${errTxt}`);
  }

  let t_firstToken = null, t_lastToken = null, outText = '', outputTokens = 0;

  if (stream) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const dataStr = line.slice(5).trim();
        if (dataStr === '[DONE]') { t_lastToken = now(); break; }
        try {
          const evt = JSON.parse(dataStr);
          const delta = evt.choices?.[0]?.delta?.content ?? '';
          if (delta) {
            if (!t_firstToken) t_firstToken = now();
            outText += delta;
            outputTokens += 1; // proxy; replace with tokenizer if you want exact
          }
        } catch {}
      }
    }
    if (!t_lastToken) t_lastToken = now();
  } else {
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content ?? '';
    t_firstToken = t2;
    t_lastToken = now();
    outText = content;
    outputTokens = content.split(/\s+/).length;
  }

  const http_connect_ms = t2 - t1;
  const client_queue_ms = t1 - t0;
  const ttft_ms = t_firstToken - t1;
  const gen_duration_ms = t_lastToken - t_firstToken;
  const total_ms = t_lastToken - t0;
  const tokens_per_s = outputTokens && gen_duration_ms > 0 ? (outputTokens / (gen_duration_ms / 1000)) : 0;

  const log = {
  ts: new Date().toISOString(),
  provider: model,   // 👈 was 'grok-1', now dynamic
  model,
    prompt_hash,
    http_connect_ms: Math.round(http_connect_ms),
    client_queue_ms: Math.round(client_queue_ms),
    ttft_ms: Math.round(ttft_ms),
    gen_duration_ms: Math.round(gen_duration_ms),
    total_ms: Math.round(total_ms),
    output_tokens: outputTokens,
    tokens_per_s: Number(tokens_per_s.toFixed(2)),
    ...metadata,
  };

  console.log(JSON.stringify({ type: 'provider_latency', ...log }));
  return { text: outText, metrics: log };
}

module.exports = { runGrok1Timed };
