import { useEffect, useState } from 'react'

export function useScoreCount(appleEaten: boolean) {
    const [scoreCount, setScoreCount] = useState(0)

    useEffect(
        function scoreCount() {
            if (appleEaten) {
                setScoreCount((prev) => prev + 1)
            }
        },
        [appleEaten]
    )

    return [scoreCount, setScoreCount] as const
}
