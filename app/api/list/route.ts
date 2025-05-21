import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
    try {
        const { blobs } = await list()

        const files = blobs.map(blob => ({
            url: blob.url,
            name: blob.pathname,
            uploadedAt: blob.uploadedAt,
        }))

        return NextResponse.json({ files })
    } catch (err) {
        console.error('Failed to list blobs:', err)
        return NextResponse.json({ error: 'Unable to list drawings' }, { status: 500 })
    }
}