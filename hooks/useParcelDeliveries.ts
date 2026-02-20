'use client'
import { useState, useEffect, useCallback } from 'react'

export interface ParcelDelivery {
  carrier_code: string
  description: string
  status_code: number
  tracking_number: string
  date_expected: string | null
  timestamp_expected: number | null
  events: Array<{
    event: string
    date: string
    location: string | null
    additional: string | null
  }>
}

export function useParcelDeliveries() {
  const [deliveries, setDeliveries] = useState<ParcelDelivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/parcel/deliveries')
      const data = await res.json()
      if (data.success === false) {
        setError(data.error_message ?? 'Failed to load deliveries')
      } else if (data.error) {
        setError(data.error)
      } else {
        setDeliveries(data.deliveries ?? [])
      }
    } catch {
      setError('Could not reach Parcel API')
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const addDelivery = async (params: {
    tracking_number: string
    carrier_code: string
    description: string
  }) => {
    const res = await fetch('/api/parcel/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, send_push_confirmation: true }),
    })
    const data = await res.json()
    if (data.success) {
      setTimeout(load, 2000)
    }
    return data
  }

  return { deliveries, loading, error, reload: load, addDelivery }
}
