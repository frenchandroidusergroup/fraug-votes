import React, { useContext } from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { StateContext } from '../AppContext'

export const HomeScreen = () => {
    const state = useContext(StateContext)

    const firstSpeakerId = state.speakersOrder[state.speakersOrderCurrentIndex]
    const firstSpeaker = state.speakers[firstSpeakerId].name

    return <Container maxWidth="md">
        <Typography variant='h1'>Question pour des grenouilles</Typography>

        <h2>{firstSpeaker} commence</h2>
        <Button variant="contained" color="primary" size="large" component={RouterLink} to={`/counter/${firstSpeakerId}`}>C'est parti !</Button>
    </Container>

}
