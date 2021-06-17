import React, { useContext } from 'react'
import { Box, Button, Container, Typography } from '@material-ui/core'
import { DispatchContext, StateContext } from '../AppContext'
import { createNewGame } from '../firebase/firebase'
import { Link, useHistory } from 'react-router-dom'

export const HomeScreen = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)
    const history = useHistory()

    const firstSpeakerId = state.speakersOrder[state.speakersOrderCurrentIndex]
    const firstSpeaker = state.speakers[firstSpeakerId].name

    const startNewGame = async () => {
        await createNewGame(dispatch)
        history.push(`/counter/${firstSpeakerId}`)
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
                <Typography variant="h2">{firstSpeaker} commence</Typography>
                <br />
                <br />
                <br />
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
                    disabled={!state.gameId}
                    component={Link}
                    to={`/counter/${firstSpeakerId}`}>
                    Reprendre la dernière partie
                </Button>
            </Container>
        </Box>
    )
}
