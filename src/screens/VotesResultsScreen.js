import React, { useContext, useEffect, useState } from 'react'
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    useTheme,
} from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import { Countdown } from '../components/Countdown'
import { Chart } from 'react-google-charts'
import {
    createNewQuestion,
    listenToVotes,
    toggleVotesOpen,
} from '../firebase/firebase'
import { DispatchContext, StateContext } from '../AppContext'
import { formatVotesResultsForGraph } from '../utils/formatVotesResultsForGraph'
import useCountDown from 'react-countdown-hook'
import { shuffleSpeakersAction } from '../state/speakersAction'

export const VotesResultsScreen = () => {
    const theme = useTheme()
    const dispatch = useContext(DispatchContext)
    const state = useContext(StateContext)
    const history = useHistory()
    const [results, setResults] = useState(null)
    const [timeLeft, { start }] = useCountDown(10000)

    useEffect(() => {
        return listenToVotes(
            dispatch,
            state.gameId,
            state.activeQuestion,
            (results) => {
                setResults(
                    formatVotesResultsForGraph(
                        results,
                        state.speakers,
                        theme.palette.players
                    )
                )
            }
        )
    }, [
        dispatch,
        state.gameId,
        state.activeQuestion,
        state.speakers,
        theme.palette.players,
    ])

    useEffect(() => {
        shuffleSpeakersAction(state.speakers, dispatch)
    }, [state.speakers, dispatch])

    useEffect(() => {
        start()
    }, [start])

    const nextSpeakerId = state.speakersOrder[state.speakersOrderCurrentIndex]
    const nextSpeaker = state.speakers[nextSpeakerId].name

    return (
        <Container maxWidth="md">
            <Grid container>
                <Grid item sm={8}>
                    <Typography variant="h1">Votes</Typography>
                </Grid>
                <Grid item sm={4}>
                    <Box margin={2}>
                        <Countdown
                            value={timeLeft / 1000}
                            size={80}
                            fontSize={30}
                        />
                    </Box>
                </Grid>
                <Grid item sm={12}>
                    <Chart
                        chartType="BarChart"
                        loader={<div>Loading Votes</div>}
                        data={results}
                        options={{
                            animation: {
                                duration: 1000,
                                easing: 'inAndOut',
                                startup: true,
                            },
                            height: 400,
                            backgroundColor: 'transparent',
                            bar: { groupWidth: '90%' },
                            legend: { position: 'none' },
                            hAxis: {
                                textStyle: { fontSize: 30 },
                                baselineColor: 'transparent',
                                minValue: 0,
                            },
                            vAxis: { textStyle: { fontSize: 30 }, minValue: 0 },
                        }}
                    />
                    <br />
                </Grid>
            </Grid>

            <Button
                onClick={async () => {
                    await createNewQuestion(dispatch, state.gameId)
                    history.push(`/counter/${nextSpeakerId}`)
                }}>
                Question suivante ({nextSpeaker} commence)
            </Button>
            <Button
                component={Link}
                to="/scores"
                onClick={() => {
                    toggleVotesOpen(state.gameId, state.activeQuestion, false)
                }}>
                Scores
            </Button>
        </Container>
    )
}
