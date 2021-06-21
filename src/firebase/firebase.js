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

const getSettingsSpeakers = async () => {
    const querySnapshot = await getDocs(collection(db, 'settings'))

    let speakers
    querySnapshot.forEach((doc) => {
        if (doc.id === 'admin') {
            speakers = doc.data().speakers
        }
    })
    return speakers
}

export const loadSettings = async (dispatch) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'settings'))

        let speakers
        let currentGameId
        querySnapshot.forEach((doc) => {
            if (doc.id === 'admin') {
                speakers = doc.data().speakers
                currentGameId = doc.data().currentGame
            }
        })
        dispatch({
            type: 'appSettingsLoaded',
            payload: {
                speakers,
                currentGameId,
            },
        })
        return {
            speakers,
            currentGameId,
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

export const loadCurrentGame = async (dispatch, gameId) => {
    if (gameId) {
        const gameSnapshot = await getDoc(doc(db, `games/${gameId}`))
        const gameData = gameSnapshot.data()
        dispatch({
            type: 'activeQuestionChanged',
            payload: gameData.currentQuestion,
        })
        dispatch({
            type: 'speakersLoaded',
            payload: gameData.speakers,
        })
        await loadQuestions(dispatch, gameId)
        dispatch({
            type: 'gameLoaded',
            payload: gameId,
        })
    } else console.warn('Attempt to resume game but no currentGameId provided')
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

export const createNewGame = async (dispatch) => {
    const speakers = await getSettingsSpeakers()
    dispatch({
        type: 'speakersLoaded',
        payload: speakers,
    })
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
    const settingsRef = doc(collection(db, 'settings'), 'admin')
    await updateDoc(settingsRef, {
        currentGame: gameId,
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
    dispatch({
        type: 'activeQuestionChanged',
        payload: questionRef.id,
    })
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
        (docsObjects) => {
            const results = aggregateVotes(docsObjects)
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

export const aggregatesFinalScores = async (speakers, gameId) => {
    const questionsIds = []
    const questionsSnapshots = await getDocs(
        collection(db, `games/${gameId}/questions`)
    )

    questionsSnapshots.forEach((doc) => {
        questionsIds.push(doc.id)
    })

    const results = Object.keys(speakers).reduce((acc, speakerId) => {
        acc[speakerId] = 0
        return acc
    }, {})

    for (const questionId of questionsIds) {
        const votesSnapshots = await getDocs(
            collection(db, `games/${gameId}/questions/${questionId}/votes`)
        )
        const votesResults = aggregateVotes(votesSnapshots)

        Object.keys(votesResults).forEach((speakerId) => {
            if (!results[speakerId]) {
                results[speakerId] = 0
            }
            results[speakerId] += votesResults[speakerId]
        })
    }

    return Object.keys(results)
        .filter((speakerId) => !!speakers[speakerId]) //only list referenced speakers
        .sort((a, b) => {
            return results[a] - results[b]
        })
        .map((speakerId) => {
            return {
                name:
                    speakerId && speakers[speakerId]
                        ? speakers[speakerId].name
                        : 'undefined',
                id: speakerId,
                score: results[speakerId],
            }
        })
}

const aggregateVotes = (votesSnapshots) => {
    const results = {}
    votesSnapshots.forEach((doc) => {
        const data = doc.data()
        if (results[data.choiceId]) {
            results[data.choiceId]++
        } else results[data.choiceId] = 1
    })
    Object.keys(results)
        .sort((a, b) => {
            return results[b] - results[a]
        })
        .reduce((acc, speakerId) => {
            acc[speakerId] = results[speakerId]
            return acc
        }, {})

    return results
}
