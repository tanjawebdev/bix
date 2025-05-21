'use client'

import { useEffect, useRef, useState } from 'react'

export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000'

        const startDrawing = (e: MouseEvent | TouchEvent) => {
            const { x, y } = getCoordinates(e, canvas)
            ctx.beginPath()
            ctx.moveTo(x, y)
            setIsDrawing(true)
        }

        const draw = (e: MouseEvent | TouchEvent) => {
            if (!isDrawing) return
            const { x, y } = getCoordinates(e, canvas)
            ctx.lineTo(x, y)
            ctx.stroke()
        }

        const endDrawing = () => {
            setIsDrawing(false)
            ctx.closePath()
        }

        const getCoordinates = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
            const rect = canvas.getBoundingClientRect()
            if ('touches' in e) {
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top,
                }
            }
            return {
                x: (e as MouseEvent).clientX - rect.left,
                y: (e as MouseEvent).clientY - rect.top,
            }
        }

        canvas.addEventListener('mousedown', startDrawing)
        canvas.addEventListener('mousemove', draw)
        canvas.addEventListener('mouseup', endDrawing)

        canvas.addEventListener('touchstart', startDrawing)
        canvas.addEventListener('touchmove', draw)
        canvas.addEventListener('touchend', endDrawing)

        return () => {
            canvas.removeEventListener('mousedown', startDrawing)
            canvas.removeEventListener('mousemove', draw)
            canvas.removeEventListener('mouseup', endDrawing)

            canvas.removeEventListener('touchstart', startDrawing)
            canvas.removeEventListener('touchmove', draw)
            canvas.removeEventListener('touchend', endDrawing)
        }
    }, [isDrawing])

    const clearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
    }

    const exportImage = (print = false) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const image = canvas.toDataURL('image/png')

        // TODO: send to backend — for now, just log
        console.log('Exported Image:', image)

        fetch('http://YOUR_BACKEND_IP:PORT/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image,
                print,
            }),
        }).then(() => {
            alert(print ? 'Sent to print!' : 'Saved successfully!')
        }).catch((err) => {
            console.error('Error sending image:', err)
            alert('Failed to send.')
        })
    }

    return (
        <section className="container max-w-2xl mx-auto text-center px-4">
            <h1 className="text-4xl font-bold mb-2">EVERYBODY IS AN ARTIST</h1>
            <p className="mb-4 text-gray-600">
                Draw your artwork and project it to the city!
            </p>

            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border-2 border-black mx-auto touch-none"
            />

            <div className="mt-4 flex justify-center gap-4">
                <button onClick={clearCanvas} className="bg-red-500 text-white px-4 py-2 rounded">
                    Clear
                </button>
                <button onClick={() => exportImage(false)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                </button>
                <button onClick={() => exportImage(true)} className="bg-green-500 text-white px-4 py-2 rounded">
                    Print
                </button>
            </div>
        </section>
    )
}