import { useContext, useEffect } from 'react'
import { DispatchContext, StateContext } from '../AppContext'
import { listenToQuestion } from './firebase'

export const QuestionsListener = () => {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext)

    useEffect(() => {
        if(state.activeQuestion) {
            return listenToQuestion(dispatch, state.activeQuestion)
        }
    }, [state.activeQuestion, dispatch])

    return null
}
