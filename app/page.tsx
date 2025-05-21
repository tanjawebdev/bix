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

        ctx.lineWidth = 25
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

    const exportImage = async () => {
        const canvas = canvasRef.current
        if (!canvas) return

        // 1. Create a new canvas to composite everything
        const exportCanvas = document.createElement('canvas')
        exportCanvas.width = canvas.width
        exportCanvas.height = canvas.height
        const ctx = exportCanvas.getContext('2d')
        if (!ctx) return

        // 2. Draw background image first
        const background = new Image()
        background.src = '/bix-frame.png'

        background.onload = async () => {
            ctx.drawImage(background, 0, 0, exportCanvas.width, exportCanvas.height)

            // 3. Draw the user's actual drawing on top
            ctx.drawImage(canvas, 0, 0)

            // 4. Draw timestamp overlay
            const now = new Date()
            const timestamp = now.toLocaleString('de-AT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })

            ctx.save()
            ctx.fillStyle = '#000'
            ctx.font = '16px monospace'

// Move to top-right corner and rotate
            ctx.translate(exportCanvas.width - 10, 0)
            ctx.rotate(-Math.PI / 2)

            ctx.fillText(timestamp, -220, -22)
            ctx.restore()

            // 5. Export final image
            const image = exportCanvas.toDataURL('image/png')
            const createdAt = now.toISOString()

            try {
                const res = await fetch('/api/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image, createdAt }),
                })

                const data = await res.json()
                if (data.url) {
                    alert('Artwork saved with background and timestamp!')
                } else {
                    alert('Upload failed.')
                }
            } catch (err) {
                console.error(err)
                alert('Failed to upload image.')
            }
        }
    }

    return (
        <section className="home-container container max-w-2xl mx-auto text-center px-4">
            <div className="header-text">
                <h1 className="text-4xl font-bold mb-2">EVERYBODY IS AN ARTIST</h1>
                <p className="mb-4 text-gray-600">
                    This project challenges the exclusivity of traditional art institutions by allowing anyone<br/> — regardless of background, age, or training — to display their work on one of Graz’s most iconic art venues.<br/> It reclaims public space for artistic expression and celebrates everyday creativity.
                </p>
            </div>
            <canvas
                ref={canvasRef}
                width={1000}
                height={500}
                className="border-2 border-black mx-auto touch-none"
            />

            <div className="buttons-bottom mt-4 flex justify-center gap-4">
                <button onClick={clearCanvas} className="bg-red-500 text-white">
                    Clear
                </button>
                <div className="buttons-right">
                    <button onClick={() => exportImage()} className="button-save bg-blue-500 text-white">
                        Save
                    </button>
                    <button onClick={() => exportImage()} className="button-print bg-green-500 text-white">
                        Print
                    </button>
                </div>
            </div>
        </section>
    )
}