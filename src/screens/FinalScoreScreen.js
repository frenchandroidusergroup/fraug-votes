import React, { useContext, useEffect, useState } from 'react'
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
} from '@material-ui/core'
import { DispatchContext, StateContext } from '../AppContext'
import { useHistory } from 'react-router-dom'
import { aggregatesFinalScores, createNewQuestion } from '../firebase/firebase'
import { playApplaudSound } from '../utils/playApplaudSound'
import { BarGraph } from '../components/BarGraph'

export const FinalScoreScreen = () => {
    const dispatch = useContext(DispatchContext)
    const state = useContext(StateContext)
    const history = useHistory()
    const [scoreBoard, setScoreBoard] = useState([])
    const [isFinished, setFinished] = useState(false)
    const nextSpeakerId = state.speakersOrder[state.speakersOrderCurrentIndex]
    const nextSpeaker = state.speakers[nextSpeakerId].name

    useEffect(() => {
        const run = async () => {
            const scores = await aggregatesFinalScores(
                state.speakers,
                state.gameId
            )
            setScoreBoard(scores)
        }
        run()
    }, [state.gameId, state.speakers])

    return (
        <Box alignItems="center" display="flex" minHeight="100vh">
            <Container maxWidth="md">
                <Box display="flex" flexDirection="column" flex={1}>
                    <Typography variant="h1">Scores</Typography>

                    <Box flex={1} height={400}>
                        <BarGraph
                            data={scoreBoard}
                            keys={['score']}
                            indexBy="name"
                            axisBottom={null}
                            enableLabel={true}
                        />
                        <br />
                    </Box>

                    {!scoreBoard.length && <CircularProgress />}

                    <br />
                    <br />
                    <br />

                    {!isFinished && (
                        <Button
                            style={{ fontSize: 20 }}
                            onClick={async () => {
                                await createNewQuestion(dispatch, state.gameId)
                                history.push(`/counter/${nextSpeakerId}`)
                            }}>
                            {nextSpeaker} commence la question suivante !
                        </Button>
                    )}
                    <Button
                        style={{ fontSize: 20 }}
                        onClick={() => {
                            setFinished(true)
                            playApplaudSound()
                        }}>
                        👏
                    </Button>
                </Box>
            </Container>
        </Box>
    )
}
