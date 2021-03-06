import { shuffle } from './speakersAction'

export const DEFAULT_STATE = {
    questions: {
        0: {
            name: 'Activity ou Fragment',
            voteOpen: false,
        },
        1: {
            name: 'Votre meilleur souvenir',
            voteOpen: false,
        },
    },
    speakers: null,
    activeQuestion: null,
    questionsLoaded: false,
    speakersLoaded: false,
    speakersOrder: [],
    speakersOrderCurrentIndex: 0,
    appSettings: {
        currentGameId: null,
        speakers: null,
        dataLoaded: false,
    },
    gameId: null,
    gameLoaded: false,
}

export const appReducer = (state, { type, payload }) => {
    console.log(`Action: ${type}`, payload)
    switch (type) {
        case 'appSettingsLoaded':
            return {
                ...state,
                appSettings: {
                    currentGameId: payload.currentGameId,
                    speakers: payload.speakers,
                    dataLoaded: true,
                },
            }
        case 'questionsLoaded':
            return {
                ...state,
                questions: payload,
                questionsLoaded: true,
            }
        case 'speakersLoaded':
            return {
                ...state,
                speakers: payload,
                speakersLoaded: true,
                speakersOrder: shuffle(Object.keys(payload)),
                speakersOrderCurrentIndex: 0,
            }
        case 'speakersOrderShuffled':
            return {
                ...state,
                speakersOrder: payload,
                speakersOrderCurrentIndex: 0,
            }
        case 'nextSpeaker':
            return {
                ...state,
                speakersOrderCurrentIndex: state.speakersOrderCurrentIndex + 1,
            }
        case 'prevSpeaker':
            return {
                ...state,
                speakersOrderCurrentIndex: state.speakersOrderCurrentIndex - 1,
            }
        case 'activeQuestionChanged':
            return {
                ...state,
                activeQuestion: payload,
            }
        case 'questionUpdated':
            return {
                ...state,
                questions: {
                    ...state.questions,
                    [payload.questionId]: payload.data,
                },
            }
        case 'gameLoaded':
            return {
                ...state,
                gameId: payload,
                gameLoaded: true,
            }
        default:
            throw new Error()
    }
}
