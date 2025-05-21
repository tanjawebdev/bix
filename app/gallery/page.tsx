'use client'

import { useEffect, useState } from 'react'

type SavedImage = {
    image: string
    created: string
}

export default function GalleryPage() {
    const [images, setImages] = useState<SavedImage[]>([])

    useEffect(() => {
        const data = localStorage.getItem("gallery")
        if (data) {
            setImages(JSON.parse(data))
        }
    }, [])

    return (
        <div className="container max-w-3xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">🎨 Saved Gallery</h1>
            {images.length === 0 && <p className="text-center text-gray-600">No saved images yet.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {images.map((img, i) => (
                    <div key={i} className="border rounded-lg p-2 shadow">
                        <img src={img.image} alt={`drawing-${i}`} className="w-full mb-2" />
                        <p className="text-xs text-gray-500 mb-2">Saved: {new Date(img.created).toLocaleString()}</p>
                        <a
                            href={img.image}
                            download={`drawing-${i + 1}.png`}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                        >
                            Download
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}