import * as React from "react"
import * as ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { Container, Nav, Navbar } from "react-bootstrap"
import { Button, Dropdown } from "semantic-ui-react"
import {
  useCallback,
  useDispatch,
  Provider,
  createStore,
  useSelector,
  useState,
  useEffect,
} from "./react_base"
import Home from "./home"
import LoginModal from "./login_modal"
import About from "./about"
import "./styles.scss"
import { apiCall as logoutCall } from "../api/logout"
import {
  apiCall as getLoginStatus,
  API_ARGS as LOGIN_STATUS_ARGS,
  Response as LoginStatusResponse,
} from "../api/get_login_status"
import { rootReducer, AppState } from "./reducers"
import setData from "./actions"

interface BaseProps {
  children: React.ReactElement | React.ReactElement[]
}

function Base(props: BaseProps) {
  const { children } = props

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const [isLogin, setIsLogin] = useState<boolean>(true)

  const dispatch = useDispatch()
  const user = useSelector((state: AppState) => state.user)

  const hideLoginModal = useCallback(() => {
    setShowLoginModal(false)
  }, [setShowLoginModal])

  const onLogin = useCallback(() => {
    setShowLoginModal(true)
    setIsLogin(true)
  }, [])

  const onSignUp = useCallback(() => {
    setShowLoginModal(true)
    setIsLogin(false)
  }, [])

  const onLogout = useCallback(() => {
    logoutCall(
      null,
      () => {
        dispatch(
          setData({
            user: null,
          }),
        )
      },
      () => {},
    )
  }, [dispatch])

  useEffect(() => {
    getLoginStatus(
      LOGIN_STATUS_ARGS,
      (data: LoginStatusResponse) => {
        if (data.email) {
          dispatch(
            setData({
              user: data,
            }),
          )
        }
      },
      () => {},
    )
  }, [dispatch])

  return (
    <>
      <LoginModal show={showLoginModal} onHide={hideLoginModal} isLogin={isLogin} />
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">Agora</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/about">About</Nav.Link>
            {user ? (
              <div className="login">
                <Dropdown
                  text={`${user.firstName} ${user.lastName}`}
                  icon="bars"
                  floating
                  labeled
                  button
                  className="icon"
                >
                  <Dropdown.Menu>
                    <Dropdown.Item text="Action" />
                    <Dropdown.Item text="Another Action" />
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={onLogout} text="Log Out" />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <span className="login">
                <Button onClick={onLogin} color="green">
                  Log In
                </Button>
                <Button onClick={onSignUp} color="orange">
                  Sign Up
                </Button>
              </span>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <div className="content-base">{children}</div>
      </Container>
    </>
  )
}

const ROUTES = {
  "/about": About,
}

const store = createStore(rootReducer)

library.add(fas, far)

ReactDOM.render(
  <Provider store={store}>
    <Base>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} index />
          {Object.keys(ROUTES).map((route) => {
            const Component = ROUTES[route]
            return <Route path={route} key={route} element={<Component />} />
          })}
        </Routes>
      </Router>
    </Base>
  </Provider>,
  document.getElementById("root"),
)
