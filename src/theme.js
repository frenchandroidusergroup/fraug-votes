import { createMuiTheme, responsiveFontSizes } from '@material-ui/core'

export const theme = responsiveFontSizes(
    createMuiTheme({
        palette: {
            type: 'light',
            primary: {
                light: "#d3f3a4",
                main: "#99BF52",
                dark: "#637d2d",
                contrastText: '#fff',
                inputLabel: '#99BF52',
            },
            secondary: {
                light: '#6ec6ff',
                main: '#2091eb',
                dark: '#0069c0',
                contrastText: '#fff',
                buttonSecondaryBackground: '#fff',
                buttonSecondaryText: '#111',
            },
            players: {
                player1: '#6ec6ff',
                player2: '#FFA000',
                player3: '#E57373'
            },
        },
        typography: {
            h2: {
                fontSize: 40,
            },
            h3: {
                fontSize: 28,
            },
        },
    })
)
