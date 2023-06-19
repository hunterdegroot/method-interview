import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import { NavBar } from '../components'
import { Upload, Report } from '../pages'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/upload" exact component={Upload} />
                <Route path="/reports" exact component={Report} />
                <Route
                    exact
                    path="/"
                    render={() => <Redirect to="/upload" />}
                />
            </Switch>
        </Router>
    )
}

export default App