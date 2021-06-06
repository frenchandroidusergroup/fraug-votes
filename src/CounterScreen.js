import React, { useState } from 'react'
import { Box, Button, Container, Typography } from '@material-ui/core'
import {
    Link,
    useParams
} from "react-router-dom"
import useCountDown from 'react-countdown-hook'
import { Countdown } from './components/Countdown'

export const CounterScreen = () => {
    const [timeLeft, { start, pause, resume, reset }] = useCountDown(20000)
    const [countdownStatus, setCountdownStatus] = useState({
        isRunning: false,
        isPaused: false,
        isFinished: false
    })
    const { name } = useParams()

    const startStop = () => {
        if (countdownStatus.isRunning) {
            pause()
            setCountdownStatus({
                ...countdownStatus,
                isRunning: false,
                isPaused: true
            })
        }else if (countdownStatus.isPaused) {
            resume()
            setCountdownStatus({
                ...countdownStatus,
                isRunning: true,
                isPaused: false
            })
        } else {
            start()
            setCountdownStatus({
                ...countdownStatus,
                isRunning: true,
                isPaused: false
            })
        }
    }
    const restart = () => {
        reset()
        start()
        setCountdownStatus({
            ...countdownStatus,
            isRunning: true,
            isFinished: false,
            isPaused: false
        })
    }

    return <Container maxWidth="sm" style={{ textAlign: "center" }}>
        <Typography variant="h1">{name}</Typography>

        <Countdown value={timeLeft / 1000}/>

        <Box display="flex" flexDirection="row">
            <Button onClick={() => {
            }}>Next (name)</Button>
            <Button onClick={() => {
            }}>Prev (name)</Button>
            <Button onClick={startStop}>Start/pause</Button>
            <Button onClick={restart}>Restart</Button>
            <Button component={Link} to="/votes">Votes</Button>
        </Box>
    </Container>

}
