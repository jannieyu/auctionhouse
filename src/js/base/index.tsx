import * as React from "react"
import * as ReactDOM from "react-dom"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { Container, Nav, Navbar } from "react-bootstrap"
import { Button, Dropdown } from "semantic-ui-react"
import {
  useCallback,
  useDispatch,
  Provider,
  configureStore,
  useSelector,
  useEffect,
} from "./react_base"
import Home from "./home"
import LoginModal from "./login_modal"
import About from "./about"
import UserProfile from "../users/user_profile"
import NotificationPage from "../notifications/notification_page"
import NewListing from "../listings/new_listing"
import "./styles.scss"
import { apiCall as logoutCall } from "../api/logout"
import {
  apiCall as getLoginStatus,
  API_ARGS as LOGIN_STATUS_ARGS,
  Response as LoginStatusResponse,
} from "../api/get_login_status"
import { rootReducer, AppState } from "./reducers"
import { setData } from "./actions"

interface BaseProps {
  children: React.ReactElement | React.ReactElement[]
}

// Paths that the user must be logged in to see
const LOGGED_IN_PATHS = new Set(["/create_listing", "/notifications"])

function PageNotFound() {
  return (
    <>
      <h1>404: Page Not Found</h1>
      <p>
        The page you requested does not exist. Please return to the <Link to="/">home page</Link>.
      </p>
    </>
  )
}

function Unauthorized() {
  return (
    <>
      <h1>Unauthorized</h1>
      <p>
        You are not authorized to view this page. Please log in or return to the{" "}
        <Link to="/">home page</Link>.
      </p>
    </>
  )
}

function Base(props: BaseProps) {
  const { children } = props

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, showLoginModal, isSignUp, notifications } = useSelector((state: AppState) => state)

  const requiresAuth = LOGGED_IN_PATHS.has(location.pathname)

  const hideLoginModal = useCallback(() => {
    dispatch(setData({ showLoginModal: false }))
  }, [dispatch])

  const onLogin = useCallback(() => {
    dispatch(setData({ showLoginModal: true }))

    dispatch(setData({ isSignUp: false }))
  }, [dispatch])

  const onSignUp = useCallback(() => {
    dispatch(setData({ showLoginModal: true }))

    dispatch(setData({ isSignUp: true }))
  }, [dispatch])

  const onLogout = useCallback(() => {
    logoutCall(
      null,
      () => {
        dispatch(
          setData({
            user: null,
          }),
        )

        if (requiresAuth) {
          navigate("/")
        }
      },
      () => {},
    )
  }, [dispatch, navigate, requiresAuth])

  const onCreateListing = useCallback(() => {
    navigate("create_listing")
  }, [navigate])

  const onClickMyProfile = useCallback(() => {
    navigate(`user_profile/?id=${user.id}`)
  }, [navigate, user])

  const onClickNotifications = useCallback(() => {
    navigate(`notifications`)
  }, [navigate])

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

  const notifStrLen = notifications.length.toString().length
  const topNotifBubbleWidth = `${notifStrLen * 2 + 6}%`
  const bottomNotifBubbleWidth = `${notifStrLen * 3 + 9}%`

  return (
    <>
      <LoginModal show={showLoginModal} onHide={hideLoginModal} isSignUp={isSignUp} />
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to="/" className="unstyled-link">
              Agora
            </Link>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Item className="nav-link">
              <Link to="/about" className="unstyled-link">
                About
              </Link>
            </Nav.Item>
            {user ? (
              <div className="login">
                <Dropdown
                  icon="bars"
                  floating
                  labeled
                  button
                  className="icon"
                  trigger={
                    <div className="name-trigger">
                      <span
                        style={
                          notifications.length
                            ? { marginRight: `${(notifStrLen - 1) * 0.2}rem` }
                            : null
                        }
                      >{`${user.firstName} ${user.lastName}`}</span>
                      {notifications.length > 0 ? (
                        <div
                          className="res-circle"
                          style={{
                            width: topNotifBubbleWidth,
                          }}
                        >
                          <div className="circle-txt">{notifications.length}</div>
                        </div>
                      ) : null}
                    </div>
                  }
                >
                  <Dropdown.Menu>
                    <Dropdown.Item text="Create Listing" onClick={onCreateListing} />
                    <Dropdown.Item text="My Profile" onClick={onClickMyProfile} />
                    <Dropdown.Item onClick={onClickNotifications}>
                      <div className="notif-dropdown">
                        Notifications{" "}
                        {notifications.length > 0 ? (
                          <div
                            className="res-circle"
                            style={{
                              width: bottomNotifBubbleWidth,
                            }}
                          >
                            <div className="circle-txt">{notifications.length}</div>
                          </div>
                        ) : null}
                      </div>
                    </Dropdown.Item>
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
        <div className="content-base">{requiresAuth && !user ? <Unauthorized /> : children}</div>
      </Container>
    </>
  )
}

const ROUTES = {
  about: About,
  create_listing: NewListing,
  user_profile: UserProfile,
  notifications: NotificationPage,
}

const store = configureStore({ reducer: rootReducer })

library.add(fas, far)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Base>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            {Object.keys(ROUTES).map((route) => {
              const Component = ROUTES[route]
              return <Route path={route} key={route} element={<Component />} />
            })}
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Base>
    </Router>
  </Provider>,
  document.getElementById("root"),
)
