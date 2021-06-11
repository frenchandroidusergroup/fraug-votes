import React, { useContext, useEffect } from 'react'
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
import { aggregateQuestionVotes } from '../firebase/firebase'
import { StateContext } from '../AppContext'

export const VotesResultsScreen = () => {
    const theme = useTheme()
    const state = useContext(StateContext)

    useEffect(() => {
        const run = async () => {
            await aggregateQuestionVotes(state.gameId, state.activeQuestion)
        }
        // noinspection JSIgnoredPromiseFromCall
        run()
    }, [state.gameId, state.activeQuestion])

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
                <Grid>
                    <Chart
                        chartType="BarChart"
                        loader={<div>Loading Votes</div>}
                        data={[
                            [
                                'Player',
                                'Votes',
                                { role: 'style' },
                                {
                                    sourceColumn: 0,
                                    role: 'annotation',
                                    type: 'string',
                                    calc: 'stringify',
                                },
                            ],
                            ['Marion', 12, theme.palette.players.player1, null],
                            [
                                'Benjamin',
                                10,
                                theme.palette.players.player2,
                                null,
                            ],
                            ['Cyril', 19, theme.palette.players.player3, null],
                        ]}
                        options={{
                            bar: { groupWidth: '95%' },
                            legend: { position: 'none' },
                        }}
                    />
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
