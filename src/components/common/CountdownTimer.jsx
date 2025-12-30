import { useState, useEffect } from 'react'

export default function CountdownTimer({ endTime }) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endTime) - new Date()

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [endTime])

    const formatTime = (time) => String(time).padStart(2, '0')

    return (
        <div className="inline-flex items-center gap-2 font-mono">
            <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">
                {formatTime(timeLeft.hours)}
            </span>
            <span className="text-white">:</span>
            <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">
                {formatTime(timeLeft.minutes)}
            </span>
            <span className="text-white">:</span>
            <span className="bg-white/10 px-2 py-1 rounded text-white font-bold">
                {formatTime(timeLeft.seconds)}
            </span>
        </div>
    )
}
