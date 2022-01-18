import { useEffect, useState } from 'react'

export function useStartGame(tailBitten: boolean, borderCrossed: boolean) {
    const [gameStarted, setGameStarted] = useState(false)

    useEffect(
        function stopGame() {
            if (tailBitten || borderCrossed) {
                setGameStarted(false)
            }
        },
        [tailBitten, borderCrossed]
    )
    return [gameStarted, setGameStarted] as const
}
