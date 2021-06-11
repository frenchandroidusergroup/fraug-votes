import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Grid, Typography } from '@material-ui/core'
import { DispatchContext, StateContext } from '../AppContext'
import { useHistory } from 'react-router-dom'
import { aggregatesFinalScores, createNewQuestion } from '../firebase/firebase'

export const FinalScoreScreen = () => {
    const dispatch = useContext(DispatchContext)
    const state = useContext(StateContext)
    const history = useHistory()
    const [scoreBoard, setScoreBoard] = useState([])
    const nextSpeakerId = state.speakersOrder[state.speakersOrderCurrentIndex]
    const nextSpeaker = state.speakers[nextSpeakerId].name

    useEffect(() => {
        const run = async () => {
            const scores = await aggregatesFinalScores(
                state.speakers,
                state.gameId
            )
            setScoreBoard(scores)
        }
        run()
    }, [state.gameId, state.speakers])

    return (
        <Container maxWidth="md">
            <Typography variant="h1">Scores</Typography>

            {scoreBoard.map((line) => (
                <Grid container key={line.name}>
                    <Grid item sm={4}>
                        <Typography variant="h2">{line.name}</Typography>
                    </Grid>
                    <Grid item sm={8}>
                        <Typography variant="h2">{line.score}</Typography>
                    </Grid>
                </Grid>
            ))}

            <br />
            <br />
            <br />

            <Button
                onClick={async () => {
                    await createNewQuestion(dispatch, state.gameId)
                    history.push(`/counter/${nextSpeakerId}`)
                }}>
                Question suivante ({nextSpeaker} commence)
            </Button>
        </Container>
    )
}
