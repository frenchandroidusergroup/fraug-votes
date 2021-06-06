import React from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'

export const HomeScreen = () => {

    return <Container maxWidth="sm">
        <Typography variant='h1'>Question pour des grenouilles</Typography>

        <h2>TODO commence</h2>
        <Button variant="contained" color="primary" size="large" component={RouterLink} to="/counter/Hugo">C'est parti !</Button>
    </Container>

}
