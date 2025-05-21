'use client'

import { useEffect, useState } from 'react'

type Drawing = {
    url: string
    name: string
    uploadedAt: string
}

export default function GalleryPage() {
    const [drawings, setDrawings] = useState<Drawing[]>([])

    useEffect(() => {
        async function fetchDrawings() {
            const res = await fetch('/api/list')
            const data = await res.json()
            setDrawings(data.files || [])
        }
        fetchDrawings()
    }, [])

    return (
        <section className="container max-w-4xl mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">🖼️ Drawing Gallery</h1>
            {drawings.length === 0 && <p>No drawings uploaded yet.</p>}
            <div className="gallery-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {drawings.map((drawing, i) => (
                    <div key={i} className="border rounded p-3 shadow">
                        <img src={drawing.url} alt={drawing.name} className="w-full h-auto mb-2" />
                        <p className="text-xs text-gray-500 mb-2">
                            {new Date(drawing.uploadedAt).toLocaleString()}
                        </p>
                        <a
                            href={drawing.url}
                            download={drawing.name}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Download
                        </a>
                    </div>
                ))}
            </div>
        </section>
    )
}