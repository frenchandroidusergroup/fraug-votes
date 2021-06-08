import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, getDocs,  doc, onSnapshot } from "firebase/firestore"

if (!getApps().length) {
    initializeApp({
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PROJECT_ID,
        appId: process.env.REACT_APP_APPID,
    })
}

const db = getFirestore()

export const loadSpeakers = async (dispatch) => {
    const querySnapshot = await getDocs(collection(db, "settings"));
    querySnapshot.forEach((doc) => {
        if(doc.id === "admin") {
            const data = doc.data()
            dispatch({
                type: "speakersLoaded",
                payload: data.speakers
            })
            dispatch({
                type: "activeQuestionChanged",
                payload: data.activeQuestion
            })
        }
    })
}

export const loadQuestions = async(dispatch) => {
    const querySnapshot = await getDocs(collection(db, "question"))
    const questions = {}
    querySnapshot.forEach((doc) => {
        questions[doc.id] = doc.data()
    })
    dispatch({
        type: "questionsLoaded",
        payload: questions
    })
}

export const changeActiveQuestion = async () => {
    console.log('TODO')
}

export const listenToQuestion = async (dispatch, questionId) => {
    console.log(`Listen to question "${questionId}"`)
    return  onSnapshot(doc(db, "question", questionId), (docObject) => {
        console.log("Current data: ", docObject.data());
        dispatch({
            type: "questionUpdated",
            payload: {
                questionId,
                data: docObject.data()
            }
        })
    })
}
