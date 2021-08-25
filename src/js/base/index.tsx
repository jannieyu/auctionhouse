import * as React from "react"
import * as ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./home"
import About from "./about"
import "./styles.scss"

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route component={About} />
    </Switch>
  </Router>,
  document.getElementById("root"),
)
