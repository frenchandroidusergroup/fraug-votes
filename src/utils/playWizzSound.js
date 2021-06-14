export const playWizzSound = () => {
    document.body.classList.toggle('shake')
    new Audio('/msn_wizz.mp3').play()
    setTimeout(() => {
        new Audio('/msn_wizz.mp3').play()
        setTimeout(() => {
            document.body.classList.toggle('shake')
        }, 800)
    }, 800)
}
