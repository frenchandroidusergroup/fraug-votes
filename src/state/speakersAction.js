export const nextSpeakerAction = (dispatch) => {
    dispatch({
        type: "nextSpeaker",
    })
}
export const prevSpeakerAction = (dispatch) => {
    dispatch({
        type: "prevSpeaker",
    })
}
export const shuffleSpeakersAction = (state, dispatch) => {
    const speakerIds =Object.keys(state.speakers)

    dispatch({
        type: "speakersOrderShuffled",
        payload: shuffle(speakerIds)
    })
}


/**
 * From https://stackoverflow.com/a/6274381/1377145
 *
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
