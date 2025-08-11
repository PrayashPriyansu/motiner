import { db, sites } from '@repo/database'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const allSites = await db.select().from(sites)
    return NextResponse.json(allSites)
  } catch (error) {
    console.error('Error fetching sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    )
  }
}