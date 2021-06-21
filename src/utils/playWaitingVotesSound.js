let audio = null

export const stopWaitingVoteAudio = () => {
    if (audio) {
        audio.pause()
    }
}

export const playWaitingVotesSound = () => {
    audio = new Audio('/frogs-chill.mp3')
    audio.volume = 0.4
    audio.play()
}
