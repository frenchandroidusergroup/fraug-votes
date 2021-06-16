import React, { useContext, useEffect, useState } from 'react'
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    useTheme,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Countdown } from '../components/Countdown'
import { Chart } from 'react-google-charts'
import { listenToVotes, toggleVotesOpen } from '../firebase/firebase'
import { DispatchContext, StateContext } from '../AppContext'
import { formatVotesResultsForGraph } from '../utils/formatVotesResultsForGraph'
import useCountDown from 'react-countdown-hook'
import { shuffleSpeakersAction } from '../state/speakersAction'
import { playWizzSound } from '../utils/playWizzSound'

export const VotesResultsScreen = () => {
    const theme = useTheme()
    const dispatch = useContext(DispatchContext)
    const state = useContext(StateContext)
    const [results, setResults] = useState(null)
    const [timeLeft, { start }] = useCountDown(30000)

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
        document.body.style.zoom = 1
    }, [start])

    return (
        <Box alignItems="center" display="flex" minHeight="100vh">
            <Container maxWidth="md">
                <div id="wizz">
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
                                    onCountdownEnd={() => {
                                        playWizzSound()
                                    }}
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
                                    height: 300,
                                    backgroundColor: 'transparent',
                                    bar: { groupWidth: '90%' },
                                    legend: { position: 'none' },
                                    hAxis: {
                                        textStyle: { fontSize: 30 },
                                        baselineColor: 'transparent',
                                        minValue: 0,
                                    },
                                    vAxis: {
                                        textStyle: { fontSize: 30 },
                                        minValue: 0,
                                    },
                                }}
                            />
                            <br />
                        </Grid>
                    </Grid>

                    <Button
                        component={Link}
                        to="/scores"
                        onClick={() => {
                            toggleVotesOpen(
                                state.gameId,
                                state.activeQuestion,
                                false
                            )
                        }}>
                        Scores
                    </Button>
                </div>
            </Container>
        </Box>
    )
}
