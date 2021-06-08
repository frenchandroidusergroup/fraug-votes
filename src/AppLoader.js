import React, { useContext, useEffect } from 'react'
import { Box, CircularProgress } from '@material-ui/core'
import { loadQuestions, loadSpeakers } from './firebase/firebase'
import { DispatchContext, StateContext } from './AppContext'

// App Loader load database data, login, and display children when everything is ready
export const AppLoader = (props) => {
    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    console.log(state)

    useEffect(() => {
        loadSpeakers(dispatch)
        loadQuestions(dispatch)
    }, [dispatch])

    if(state.questionsLoaded && state.speakersLoaded) {
        return props.children
    }

    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress/>
    </Box>

}
