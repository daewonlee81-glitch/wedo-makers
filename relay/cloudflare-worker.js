/**
 * WeDo Makers AI 튜터 — 중계 서버 (Cloudflare Workers)
 *
 * 학생 PC에는 API 키를 두지 않고, 이 서버가 키를 붙여 Claude 에 전달합니다.
 * 설정(Workers → Settings → Variables):
 *   ANTHROPIC_API_KEY  (Secret)  Anthropic API 키
 *   ALLOWED_ORIGINS    (Text)    허용할 사이트, 쉼표로 구분. 예: https://daewonlee81-glitch.github.io
 *   DAILY_LIMIT        (Text, 선택) 하루 최대 질문 수 (기본 500, KV 바인딩 USAGE 가 있을 때만)
 */
const ALLOWED_MODELS = ['claude-haiku-5-5', 'claude-sonnet-5-5'];
const MAX_TOKENS = 800;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const okOrigin = allowed.length === 0 || allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': okOrigin ? origin || '*' : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405, cors);
    if (!okOrigin) return json({ error: 'origin not allowed' }, 403, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'ANTHROPIC_API_KEY is not set' }, 500, cors);

    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400, cors); }

    // 하루 사용량 제한 (선택: KV 네임스페이스를 USAGE 로 바인딩)
    if (env.USAGE) {
      const key = 'd:' + new Date().toISOString().slice(0, 10);
      const used = Number((await env.USAGE.get(key)) || 0);
      if (used >= Number(env.DAILY_LIMIT || 500)) return json({ error: 'daily limit reached' }, 429, cors);
      await env.USAGE.put(key, String(used + 1), { expirationTtl: 60 * 60 * 48 });
    }

    // 앱이 보내는 형식만 통과시키고, 모델·길이는 서버에서 제한
    const safe = {
      model: ALLOWED_MODELS.includes(body.model) ? body.model : ALLOWED_MODELS[0],
      max_tokens: Math.min(Number(body.max_tokens) || 600, MAX_TOKENS),
      system: typeof body.system === 'string' ? body.system.slice(0, 6000) : undefined,
      messages: Array.isArray(body.messages) ? body.messages.slice(-10).map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content || '').slice(0, 12000)
      })) : []
    };
    if (!safe.messages.length) return json({ error: 'no messages' }, 400, cors);

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(safe)
    });
    return new Response(await res.text(), { status: res.status, headers: { ...cors, 'content-type': 'application/json' } });
  }
};

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, 'content-type': 'application/json' } });
}
