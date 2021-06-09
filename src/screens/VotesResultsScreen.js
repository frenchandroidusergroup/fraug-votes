import React from 'react'
import { Button, Container, Grid, Typography, useTheme } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Countdown } from '../components/Countdown'
import "./VotesResultsScreen.css"
import { Chart } from "react-google-charts";

export const VotesResultsScreen = () => {
    const theme = useTheme()

    return <Container maxWidth="sm">
        <Grid container>
            <Grid item sm={8}>
                <Typography variant="h1">Votes</Typography>
            </Grid>
            <Grid item sm={4}>
                <div  className="countdown">
                    <Countdown value={30} size={80} fontSize={30}/>
                </div>
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
                        ['Benjamin', 10, theme.palette.players.player2, null],
                        ['Cyril', 19, theme.palette.players.player3, null],
                    ]}
                    options={{
                        bar: { groupWidth: '95%' },
                        legend: { position: 'none' },
                    }}
                />
            </Grid>
        </Grid>

        <Button >New vote round</Button>
        <Button >Clear current vote round</Button>
        <Button component={Link} to="/scores">Scores</Button>
    </Container>

}
