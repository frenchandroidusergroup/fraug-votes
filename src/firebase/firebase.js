import { initializeApp, getApps } from 'firebase/app'
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    doc,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signOut } from 'firebase/auth'

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

export const loadCurrentGame = async (dispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'settings'))

        let currentGameId
        querySnapshot.forEach((doc) => {
            if (doc.id === 'admin') {
                const data = doc.data()
                dispatch({
                    type: 'speakersLoaded',
                    payload: data.speakers,
                })
                currentGameId = data.currentGame
            }
        })
        if (currentGameId) {
            dispatch({
                type: 'gameLoaded',
                payload: currentGameId,
            })
            const gameSnapshot = await getDoc(doc(db, `games/${currentGameId}`))
            const gameData = gameSnapshot.data()
            dispatch({
                type: 'activeQuestionChanged',
                payload: gameData.currentQuestion,
            })
            dispatch({
                type: 'speakersLoaded',
                payload: gameData.speakers,
            })
            await loadQuestions(dispatch, currentGameId)
        }
    } catch (error) {
        if (error.code === 'permission-denied') {
            alert(
                'You need to sign in and be authorized by the service owners (settings.admin.adminEmails)'
            )
            signOut(auth)
            return
        }
        console.error(error)
    }
}

export const loadQuestions = async (dispatch, gameId) => {
    const querySnapshot = await getDocs(
        collection(db, `games/${gameId}/questions`)
    )
    const questions = {}
    querySnapshot.forEach((doc) => {
        questions[doc.id] = doc.data()
    })
    dispatch({
        type: 'questionsLoaded',
        payload: questions,
    })
}

export const listenToQuestion = async (dispatch, gameId, questionId) => {
    console.log(`- Listen to question "${questionId}"`)
    return onSnapshot(
        doc(db, `games/${gameId}/questions`, questionId),
        (docObject) => {
            dispatch({
                type: 'questionUpdated',
                payload: {
                    questionId,
                    data: docObject.data(),
                },
            })
        }
    )
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
        type: 'gameLoaded',
        payload: gameId,
    })
    // TODO: set currentGame to settings/admin
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

export const changeActiveQuestion = async () => {
    console.log('TODO')
}

export const listenToVotes = async (
    dispatch,
    gameId,
    questionId,
    onResultsUpdated
) => {
    console.log(`- Listen to votes "${questionId}"`)
    return onSnapshot(
        collection(db, `games/${gameId}/questions/${questionId}/votes`),
        (docObject) => {
            const results = {}
            docObject.forEach((doc) => {
                const data = doc.data()
                if (results[data.choiceId]) {
                    results[data.choiceId]++
                } else results[data.choiceId] = 1
            })
            onResultsUpdated(results)
        }
    )
}

export const toggleVotesOpen = async (gameId, questionId, shouldBeOpen) => {
    const questionsCollectionRef = doc(
        collection(db, `games/${gameId}/questions`),
        questionId
    )
    await updateDoc(questionsCollectionRef, {
        voteOpened: shouldBeOpen,
    })
}
