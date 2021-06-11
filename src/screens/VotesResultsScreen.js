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
import { listenToVotes } from '../firebase/firebase'
import { DispatchContext, StateContext } from '../AppContext'
import { formatVotesResultsForGraph } from '../utils/formatVotesResultsForGraph'

export const VotesResultsScreen = () => {
    const theme = useTheme()
    const dispatch = useContext(DispatchContext)
    const state = useContext(StateContext)
    const [results, setResults] = useState(null)

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

    return (
        <Container maxWidth="md">
            <Grid container>
                <Grid item sm={8}>
                    <Typography variant="h1">Votes</Typography>
                </Grid>
                <Grid item sm={4}>
                    <Box margin={2}>
                        <Countdown value={30} size={80} fontSize={30} />
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
                            },
                            vAxis: { textStyle: { fontSize: 30 } },
                        }}
                    />
                    <br />
                </Grid>
            </Grid>

            <Button>New vote round</Button>
            <Button>Clear current vote round</Button>
            <Button component={Link} to="/scores">
                Scores
            </Button>
        </Container>
    )
}
