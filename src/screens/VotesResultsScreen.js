import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Grid, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Countdown } from '../components/Countdown'
import { listenToVotes, toggleVotesOpen } from '../firebase/firebase'
import { DispatchContext, StateContext } from '../AppContext'
import {
    formatVotesResultsForGraph,
    generateAxisValues,
} from '../utils/formatVotesResultsForGraph'
import useCountDown from 'react-countdown-hook'
import { shuffleSpeakersAction } from '../state/speakersAction'
import { playWizzSound } from '../utils/playWizzSound'
import { BarGraph } from '../components/BarGraph'
import {
    playWaitingVotesSound,
    stopWaitingVoteAudio,
} from '../utils/playWaitingVotesSound'

export const VotesResultsScreen = () => {
    const dispatch = useContext(DispatchContext)
    const state = useContext(StateContext)
    const [graphData, setGraphData] = useState({
        data: [],
        axisValues: [],
    })
    const [timeLeft, { start }] = useCountDown(30000)

    useEffect(() => {
        return listenToVotes(
            dispatch,
            state.gameId,
            state.activeQuestion,
            (results) => {
                const formattedValues = formatVotesResultsForGraph(
                    results,
                    state.speakers
                )
                setGraphData({
                    data: formattedValues,
                    axisValues: generateAxisValues(formattedValues),
                })
            }
        )
    }, [dispatch, state.gameId, state.activeQuestion, state.speakers])

    useEffect(() => {
        shuffleSpeakersAction(state.speakers, dispatch)
    }, [state.speakers, dispatch])

    useEffect(() => {
        start()
        playWaitingVotesSound()
        document.body.style.zoom = 1
        return () => {
            stopWaitingVoteAudio()
        }
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
                                    size={110}
                                    fontSize={50}
                                    onCountdownEnd={() => {
                                        playWizzSound()
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item sm={12}>
                            <BarGraph
                                data={graphData.data}
                                keys={['Votes']}
                                indexBy="name"
                                axisBottom={{
                                    tickValues: graphData.axisValues,
                                }}
                            />
                            <br />
                        </Grid>
                    </Grid>

                    <Button
                        component={Link}
                        to="/scores"
                        style={{ float: 'right' }}
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
