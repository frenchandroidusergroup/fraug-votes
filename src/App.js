import { createMuiTheme, CssBaseline, responsiveFontSizes, ThemeProvider } from '@material-ui/core'
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom'
import { HomeScreen } from './HomeScreen'
import { CounterScreen } from './CounterScreen'
import { FinalScoreScreen } from './FinalScoreScreen'
import { VotesResultsScreen } from './VotesResultsScreen'



const theme = responsiveFontSizes(
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

function App() {
  return (
    <div>
        <CssBaseline/>
        <main>
            <ThemeProvider theme={theme}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={HomeScreen} />
                        <Route path="/counter/:name" component={CounterScreen} />
                        <Route path="/votes" component={VotesResultsScreen} />
                        <Route path="/scores" component={FinalScoreScreen} />

                        <Route component={HomeScreen} status={404} />
                    </Switch>
                </Router>
            </ThemeProvider>
        </main>
    </div>
  );
}

export default App;
