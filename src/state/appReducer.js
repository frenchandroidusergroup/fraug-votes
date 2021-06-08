
export const DEFAULT_STATE = {
    questions: {
        0: {
            name: "Activity ou Fragment",
            voteOpen: false
        },
        1: {
            name: "Votre meilleur souvenir",
            voteOpen: false
        }
    },
    speakers: null,
    activeQuestion: null,
    questionsLoaded: false,
    speakersLoaded: false
}


export const appReducer = (state, { type, payload }) => {
    console.log(`Action: ${type}`, payload)
    switch (type) {
        case "questionsLoaded":
            return {
                ...state,
                questions: payload,
                questionsLoaded: true
            }
        case "speakersLoaded":
            return {
                ...state,
                speakers: payload,
                speakersLoaded: true
            }
        case "activeQuestionChanged":
            return {
                ...state,
                activeQuestion: payload
            }
        case "questionUpdated":
            return {
                ...state,
                questions: {
                    ...state.questions,
                    [payload.questionId]: payload.data
                }
            }
        default:
            throw new Error();
    }
}
