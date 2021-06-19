import React, { useContext, useEffect } from 'react'
import { Box, CircularProgress } from '@material-ui/core'
import { loadCurrentGame } from './firebase/firebase'
import { DispatchContext, StateContext } from './AppContext'

// Load a current game
export const AppGameLoader = (props) => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    useEffect(() => {
        if (
            state.appSettings.dataLoaded &&
            !state.gameLoaded &&
            state.appSettings.currentGameId
        ) {
            // noinspection JSIgnoredPromiseFromCall
            loadCurrentGame(dispatch, state.appSettings.currentGameId)
        }
    }, [
        dispatch,
        state.gameLoaded,
        state.appSettings.dataLoaded,
        state.appSettings.currentGameId,
    ])

    if (state.gameLoaded) {
        return props.children
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh">
            <CircularProgress />
        </Box>
    )
}
