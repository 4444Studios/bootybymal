const GOOGLE_FORM_RESPONSE =
  'https://docs.google.com/forms/d/e/1FAIpQLScdJWwmtroPL3rji7M31OcceNxawLVuw9J85lqHw6rVrjkH9A/formResponse'

const ALLOWED_ORIGINS = [
  'https://bootybyemal.com',
  'https://www.bootybyemal.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

function corsHeaders(origin: string | null): HeadersInit {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

export default {
  async fetch(request: Request): Promise<Response> {
    const origin = request.headers.get('Origin')
    const cors = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const body = await request.text()
    if (!body) {
      return new Response(JSON.stringify({ ok: false, error: 'Empty body' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const googleRes = await fetch(GOOGLE_FORM_RESPONSE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      redirect: 'follow',
    })

    const ok = googleRes.ok || googleRes.status === 200
    return new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : 502,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  },
}
