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
import { listenToVotes, toggleVotesOpen } from '../firebase/firebase'
import { DispatchContext, StateContext } from '../AppContext'
import {
    formatVotesResultsForGraph,
    generateAxisValues,
} from '../utils/formatVotesResultsForGraph'
import useCountDown from 'react-countdown-hook'
import { shuffleSpeakersAction } from '../state/speakersAction'
import { playWizzSound } from '../utils/playWizzSound'
import { ResponsiveBar } from '@nivo/bar'

export const VotesResultsScreen = () => {
    const theme = useTheme()
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
                            <ResponsiveBar
                                data={graphData.data}
                                keys={['Votes']}
                                indexBy="name"
                                theme={{
                                    fontSize: 24,
                                }}
                                colors={getColor(theme)}
                                margin={{
                                    top: 50,
                                    right: 130,
                                    bottom: 50,
                                    left: 110,
                                }}
                                padding={0.25}
                                minValue={0}
                                height={400}
                                layout="horizontal"
                                valueScale={{ type: 'linear' }}
                                indexScale={{ round: true }}
                                borderRadius={10}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickValues: graphData.axisValues,
                                }}
                                axisLeft={{
                                    tickSize: 0,
                                    tickPadding: 15,
                                }}
                                enableGridY={false}
                                enableLabel={false}
                                animate={true}
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
const getColor = (theme) => (bar) => {
    return theme.palette.players[bar.index]
}
