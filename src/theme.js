import { createMuiTheme, responsiveFontSizes } from '@material-ui/core'

export const theme = responsiveFontSizes(
    createMuiTheme({
        palette: {
            type: 'light',
            primary: {
                light: '#d3f3a4',
                main: '#99BF52',
                dark: '#637d2d',
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
            players: ['#6ec6ff', '#FFA000', '#E57373', '#19a819'],
        },
        typography: {
            h2: {
                fontSize: 50,
            },
            h3: {
                fontSize: 35,
            },
        },
    })
)
