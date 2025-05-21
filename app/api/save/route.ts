import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const runtime = 'edge'

export async function POST(req: Request) {
    const body = await req.json()
    const { image, createdAt } = body

    if (!image || !createdAt) {
        return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    try {
        const buffer = Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ''),
            'base64'
        )
        const filename = `drawing-${createdAt}.png`

        const blob = await put(filename, buffer, {
            contentType: 'image/png',
            access: 'public',
        })

        return NextResponse.json({ url: blob.url })
    } catch (err) {
        console.error('Blob upload failed:', err)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}