import React, { useContext, useEffect } from 'react'
import { Box, CircularProgress } from '@material-ui/core'
import { loadSettings } from './firebase/firebase'
import { DispatchContext, StateContext } from './AppContext'

// App Loader load database data, login, and display children when everything is ready
export const AppLoader = (props) => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)

    useEffect(() => {
        if (!state.appSettings.dataLoaded) {
            // noinspection JSIgnoredPromiseFromCall
            loadSettings(dispatch)
        }
    }, [dispatch, state.appSettings.dataLoaded])

    if (state.appSettings.dataLoaded) {
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
