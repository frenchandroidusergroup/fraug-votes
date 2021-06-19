import React, { useReducer } from 'react'
import { CssBaseline, ThemeProvider } from '@material-ui/core'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { HomeScreen } from './screens/HomeScreen'
import { CounterScreen } from './screens/CounterScreen'
import { FinalScoreScreen } from './screens/FinalScoreScreen'
import { VotesResultsScreen } from './screens/VotesResultsScreen'
import { theme } from './theme'
import { QuestionsListener } from './firebase/QuestionsListener'
import { AppLoader } from './AppLoader'
import './firebase/firebase'
import { appReducer, DEFAULT_STATE } from './state/appReducer'
import { StateContext, DispatchContext } from './AppContext'
import { Login } from './components/Login'
import { AppGameLoader } from './AppGameLoader'

export const App = () => {
    const [state, dispatch] = useReducer(appReducer, DEFAULT_STATE)

    return (
        <div>
            <CssBaseline />
            <main>
                <ThemeProvider theme={theme}>
                    <Login>
                        <DispatchContext.Provider value={dispatch}>
                            <StateContext.Provider value={state}>
                                <QuestionsListener />
                                <AppLoader>
                                    <Router>
                                        <Switch>
                                            <Route
                                                exact
                                                path="/"
                                                component={HomeScreen}
                                            />
                                            <AppGameLoader>
                                                <Route
                                                    path="/counter/:speakerId"
                                                    render={(props) => (
                                                        <CounterScreen
                                                            key={
                                                                props.match
                                                                    .params
                                                                    .speakerId
                                                            }
                                                        />
                                                    )}
                                                />
                                                <Route
                                                    path="/votes"
                                                    component={
                                                        VotesResultsScreen
                                                    }
                                                />
                                                <Route
                                                    path="/scores"
                                                    component={FinalScoreScreen}
                                                />
                                            </AppGameLoader>
                                            <Route
                                                component={HomeScreen}
                                                status={404}
                                            />
                                        </Switch>
                                    </Router>
                                </AppLoader>
                            </StateContext.Provider>
                        </DispatchContext.Provider>
                    </Login>
                </ThemeProvider>
            </main>
        </div>
    )
}
