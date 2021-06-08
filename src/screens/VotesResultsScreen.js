import React from 'react'
import { Button, Container, Grid, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

export const VotesResultsScreen = () => {

    // Nivo is a great graph lib
    return <Container maxWidth="sm">
        <Grid container>
            <Grid item sm={8}>
                <Typography variant="h1">Votes</Typography>
            </Grid>
            <Grid item sm={4}>
                (counter here)
            </Grid>
        </Grid>

        <Button >New vote round</Button>
        <Button >Clear current vote round</Button>
        <Button component={Link} to="/scores">Scores</Button>
    </Container>

}
