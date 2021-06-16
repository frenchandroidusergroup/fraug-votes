import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Typography } from '@material-ui/core'
import { Link, useParams } from 'react-router-dom'
import useCountDown from 'react-countdown-hook'
import { Countdown } from '../components/Countdown'
import { DispatchContext, StateContext } from '../AppContext'
import { nextSpeakerAction, prevSpeakerAction } from '../state/speakersAction'
import { playWizzSound } from '../utils/playWizzSound'

export const CounterScreen = () => {
    const state = useContext(StateContext)
    const dispatch = useContext(DispatchContext)
    const [timeLeft, { start, pause, resume, reset }] = useCountDown(30000)
    const [countdownStatus, setCountdownStatus] = useState({
        isRunning: false,
        isPaused: false,
        isFinished: false,
    })
    const { speakerId } = useParams()

    const startStop = () => {
        if (countdownStatus.isRunning) {
            pause()
            setCountdownStatus({
                ...countdownStatus,
                isRunning: false,
                isPaused: true,
            })
        } else if (countdownStatus.isPaused) {
            resume()
            setCountdownStatus({
                ...countdownStatus,
                isRunning: true,
                isPaused: false,
            })
        } else {
            start()
            setCountdownStatus({
                ...countdownStatus,
                isRunning: true,
                isPaused: false,
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
            isPaused: false,
        })
    }

    useEffect(() => {
        start() // auto start on component mount
        document.body.style.zoom = 2.2
    }, [start])

    const prevSpeakerId =
        state.speakersOrder[state.speakersOrderCurrentIndex - 1]
    const nextSpeakerId =
        state.speakersOrder[state.speakersOrderCurrentIndex + 1]

    return (
        <Container maxWidth="sm" style={{ textAlign: 'center' }}>
            <div id="wizz">
                <Typography variant="h1">{speakerId}</Typography>

                <Countdown
                    value={timeLeft / 1000}
                    size={300}
                    fontSize={150}
                    onCountdownEnd={() => {
                        playWizzSound()
                    }}
                />

                <Box display="flex" flexDirection="row" justifyContent="center">
                    <Button
                        component={Link}
                        style={{ fontSize: 30 }}
                        disabled={!prevSpeakerId}
                        onClick={() => prevSpeakerAction(dispatch)}
                        to={`/counter/${prevSpeakerId}`}>
                        Prev{' '}
                        {prevSpeakerId
                            ? `(${state.speakers[prevSpeakerId].name})`
                            : ''}
                    </Button>

                    <Button
                        style={{ fontSize: 30 }}
                        component={Link}
                        disabled={!nextSpeakerId}
                        onClick={() => nextSpeakerAction(dispatch)}
                        to={`/counter/${nextSpeakerId}`}>
                        Next (
                        {nextSpeakerId && state.speakers[nextSpeakerId].name})
                    </Button>
                    {!nextSpeakerId && (
                        <Button
                            component={Link}
                            to="/votes"
                            style={{ fontSize: 30 }}>
                            Votes
                        </Button>
                    )}
                </Box>

                <Box display="flex" flexDirection="row" justifyContent="center">
                    <Button onClick={startStop}>Start/pause</Button>
                    <Button onClick={restart}>Restart</Button>
                </Box>
            </div>
        </Container>
    )
}
