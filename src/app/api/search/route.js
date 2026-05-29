import { NextResponse } from 'next/server'
import { searchListings } from '@/lib/guesty'

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const checkIn  = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')
  const guests   = Number(searchParams.get('guests') || 1)

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      { error: 'checkIn y checkOut son requeridos' },
      { status: 400 }
    )
  }

  try {
    const data = await searchListings({ checkIn, checkOut, guests })
    return NextResponse.json(data)
  } catch (err) {
    console.error('[/api/search]', err.message)
    return NextResponse.json(
      { error: 'Error al consultar disponibilidad' },
      { status: 502 }
    )
  }
}
