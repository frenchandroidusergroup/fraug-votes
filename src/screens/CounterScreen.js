import React, { useContext, useState } from 'react'
import { Box, Button, Container, Typography } from '@material-ui/core'
import {
    Link,
    useParams
} from "react-router-dom"
import useCountDown from 'react-countdown-hook'
import { Countdown } from '../components/Countdown'
import { DispatchContext, StateContext } from '../AppContext'
import { nextSpeakerAction, prevSpeakerAction } from '../state/speakersAction'

export const CounterScreen = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)
    const [timeLeft, { start, pause, resume, reset }] = useCountDown(20000)
    const [countdownStatus, setCountdownStatus] = useState({
        isRunning: false,
        isPaused: false,
        isFinished: false
    })
    const { speakerId } = useParams()

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

    const prevSpeakerId = state.speakersOrder[state.speakersOrderCurrentIndex -1]
    const nextSpeakerId = state.speakersOrder[state.speakersOrderCurrentIndex +1]

    return <Container maxWidth="sm" style={{ textAlign: "center" }}>
        <Typography variant="h1">{speakerId}</Typography>

        <Countdown value={timeLeft / 1000}/>

        <Box display="flex" flexDirection="row">

            {prevSpeakerId && <Button
                component={Link}
                onClick={() => prevSpeakerAction(dispatch)}
                to={`/counter/${prevSpeakerId}`}>
                Prev ({state.speakers[prevSpeakerId].name})
            </Button>}

            {nextSpeakerId && <Button
                component={Link}
                onClick={() => nextSpeakerAction(dispatch)}
                to={`/counter/${nextSpeakerId}`}>
                Next ({state.speakers[nextSpeakerId].name})
            </Button>}
        </Box>

        <Box display="flex" flexDirection="row">
            <Button onClick={startStop}>Start/pause</Button>
            <Button onClick={restart}>Restart</Button>
            {!nextSpeakerId && <Button component={Link} to="/votes">Votes</Button>}
        </Box>
    </Container>

}
