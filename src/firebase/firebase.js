import { initializeApp, getApps } from 'firebase/app'
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

if (!getApps().length) {
    initializeApp({
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PROJECT_ID,
        appId: process.env.REACT_APP_APPID,
    })
}

const db = getFirestore()
export const auth = getAuth()
export const authProvider = new GoogleAuthProvider()

export const loadSpeakers = async (dispatch) => {
    const querySnapshot = await getDocs(collection(db, 'settings'))
    querySnapshot.forEach((doc) => {
        if (doc.id === 'admin') {
            const data = doc.data()
            dispatch({
                type: 'speakersLoaded',
                payload: data.speakers,
            })
            dispatch({
                type: 'activeQuestionChanged',
                payload: data.activeQuestion,
            })
        }
    })
}

export const loadQuestions = async (dispatch) => {
    const querySnapshot = await getDocs(collection(db, 'question'))
    const questions = {}
    querySnapshot.forEach((doc) => {
        questions[doc.id] = doc.data()
    })
    dispatch({
        type: 'questionsLoaded',
        payload: questions,
    })
}

export const changeActiveQuestion = async () => {
    console.log('TODO')
}

export const listenToQuestion = async (dispatch, questionId) => {
    console.log(`Listen to question "${questionId}"`)
    return onSnapshot(doc(db, 'question', questionId), (docObject) => {
        console.log('Current data: ', docObject.data())
        dispatch({
            type: 'questionUpdated',
            payload: {
                questionId,
                data: docObject.data(),
            },
        })
    })
}

export const createNewGame = async (dispatch, speakers) => {
    const gameReference = await addDoc(collection(db, 'games'), {
        currentQuestion: 0,
        speakers,
        startDate: serverTimestamp(),
    })
    const gameId = gameReference.id
    await createNewQuestion(dispatch, gameId)
    dispatch({
        type: 'questionUpdated',
        payload: gameId,
    })
    return gameId
}

export const createNewQuestion = async (dispatch, gameId) => {
    const questionRef = await addDoc(
        collection(doc(collection(db, 'games'), gameId), 'questions'),
        {
            voteOpened: true,
        }
    )

    //update currentQuestion with new questionId
    const questionsCollectionRef = doc(collection(db, 'games'), gameId)
    await updateDoc(questionsCollectionRef, {
        currentQuestion: questionRef.id,
    })
}
