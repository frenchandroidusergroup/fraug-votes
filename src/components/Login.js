import React, { useEffect, useState } from 'react'
import { Box, Button, Container } from '@material-ui/core'
import { onAuthStateChanged, signInWithRedirect, signOut } from 'firebase/auth'
import { auth, authProvider } from '../firebase/firebase'

export const Login = ({ children }) => {
    const [isLoggedIn, setLoginStatus] = useState(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoginStatus(true)
            } else {
                setLoginStatus(false)
            }
        })
    }, [])

    if (!isLoggedIn) {
        return (
            <Box
                justifyContent="center"
                alignItems="center"
                display="flex"
                height="100vh">
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => {
                        signInWithRedirect(auth, authProvider)
                    }}>
                    Google Sign-in
                </Button>
            </Box>
        )
    }

    return (
        <Box>
            {children}

            <Container maxWidth="md" component={Box} marginTop={10}>
                <Button
                    onClick={() => {
                        signOut(auth)
                    }}>
                    Logout
                </Button>
            </Container>
        </Box>
    )
}
