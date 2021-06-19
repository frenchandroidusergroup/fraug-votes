import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Typography } from '@material-ui/core'
import { DispatchContext, StateContext } from '../AppContext'
import { createNewGame, loadCurrentGame } from '../firebase/firebase'
import { Link } from 'react-router-dom'

export const HomeScreen = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)
    const [gameStartModePicked, setGameStartModePicked] = useState(false)
    const [firstSpeaker, setFirstSpeaker] = useState({
        id: null,
        name: null,
    })

    useEffect(() => {
        if (!gameStartModePicked) {
            return
        }
        const firstSpeakerId =
            state.speakersOrder[state.speakersOrderCurrentIndex]
        const name = state.speakers[firstSpeakerId].name

        setFirstSpeaker({
            id: firstSpeakerId,
            name: name,
        })
    }, [
        gameStartModePicked,
        state.speakers,
        state.speakersOrder,
        state.speakersOrderCurrentIndex,
    ])

    const startNewGame = async () => {
        await createNewGame(dispatch)
        setGameStartModePicked(true)
    }
    const resumeGame = async () => {
        await loadCurrentGame(dispatch, state.appSettings.currentGameId)
        setGameStartModePicked(true)
    }

    return (
        <Box alignItems="center" display="flex" minHeight="100vh">
            <Container maxWidth="sm">
                <Typography variant="h1">
                    Question pour des grenouilles
                </Typography>
                <br />
                <br />
                <br />
                {firstSpeaker.name && (
                    <Typography variant="h2">
                        {firstSpeaker.name} commence
                    </Typography>
                )}
                <br />
                <br />
                <br />
                {gameStartModePicked ? (
                    <>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            disabled={!state.appSettings.currentGameId}
                            component={Link}
                            to={`/counter/${firstSpeaker.id}`}>
                            Démarrer
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={startNewGame}>
                            Nouvelle partie
                        </Button>{' '}
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            disabled={!state.appSettings.currentGameId}
                            onClick={resumeGame}>
                            Reprendre la dernière partie
                        </Button>
                    </>
                )}
            </Container>
        </Box>
    )
}
