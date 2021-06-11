import React, { useContext } from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { DispatchContext, StateContext } from '../AppContext'
import { createNewGame } from '../firebase/firebase'
import { useHistory } from "react-router-dom";

export const HomeScreen = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext);
    const history = useHistory();


    const firstSpeakerId = state.speakersOrder[state.speakersOrderCurrentIndex]
    const firstSpeaker = state.speakers[firstSpeakerId].name

    const startNewGame = async () => {
        await createNewGame(dispatch)
        history.push(`/counter/${firstSpeakerId}`)
    }


    return <Container maxWidth="md">
        <Typography variant='h1'>Question pour des grenouilles</Typography>

        <h2>{firstSpeaker} commence</h2>
        <Button variant="contained" color="primary" size="large" component={RouterLink} onClick={startNewGame} >C'est parti !</Button>
    </Container>

}
