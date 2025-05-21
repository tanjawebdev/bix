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

    const exportImage = (print = false) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const image = canvas.toDataURL('image/png')

        const images = JSON.parse(localStorage.getItem("gallery") || "[]")
        images.push({ image, created: new Date().toISOString() })
        localStorage.setItem("gallery", JSON.stringify(images))
        alert('Saved locally. View it in /gallery.')
    }

    return (
        <section className="container max-w-2xl mx-auto text-center px-4">
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
                    <button onClick={() => exportImage(false)} className="button-save bg-blue-500 text-white">
                        Save
                    </button>
                    <button onClick={() => exportImage(true)} className="button-print bg-green-500 text-white">
                        Print
                    </button>
                </div>
            </div>
        </section>
    )
}