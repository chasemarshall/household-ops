import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.PARCEL_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Parcel API key not configured' }, { status: 503 })
  }

  const body = await req.json()

  const res = await fetch('https://api.parcel.app/external/add-delivery/', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.ok ? 200 : 400 })
}
