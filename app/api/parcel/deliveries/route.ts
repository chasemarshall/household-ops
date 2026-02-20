import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.PARCEL_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Parcel API key not configured' }, { status: 503 })
  }

  const res = await fetch('https://api.parcel.app/external/deliveries/?filter_mode=active', {
    headers: { 'api-key': apiKey },
    next: { revalidate: 180 },
  })

  const data = await res.json()
  return NextResponse.json(data)
}
