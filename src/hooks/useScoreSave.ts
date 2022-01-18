import { useEffect, useState } from 'react'

export function useScoreSave(
    tailBitten: boolean,
    borderCrossed: boolean,
    scoreCount: number
) {
    const [bestScore, setBestScore] = useState(0)

    useEffect(() => {
        const savedBestScore = Number(localStorage.getItem('bestScore'))

        if (savedBestScore) {
            setBestScore(savedBestScore)
        }

        if (tailBitten || borderCrossed) {
            if (bestScore < scoreCount) {
                setBestScore(scoreCount)
                localStorage.setItem('bestScore', String(scoreCount))
            }
        }
    }, [tailBitten, borderCrossed, scoreCount, bestScore])

    return bestScore
}
