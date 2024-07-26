import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import './css/style.css'
import moment from 'moment'

import BookingForm from './components/BookingForm'
import Button from './components/Button'
import FilterElement from './components/FilterElement'
import Footer from './components/Footer'
import Key from './components/Key'
import MyBookings from './components/MyBookings'
import NavBar from './components/NavBar'
import NodesList from './components/NodesList'
import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'

import {
  signIn,
  signOut,
  signUp
} from './api/auth'
import { listNodes } from './api/nodes'
import { getDecodedToken } from './api/token'
import { makeBooking, deleteBooking, updateStateNode } from './api/booking'
import Calendar from './components/Calendar'
import BookingModal from './components/BookingModal'
import { floorParams, filterParams, capacityParams, onFilterByFloor, onFilterByFeature, onFilterByCapacity, onFilterByAvailablity } from './helpers/filters'
import { initialNode } from './helpers/nodes'

class App extends Component {
  state = {
    decodedToken: getDecodedToken(), // retrieves the token from local storage if valid, else will be null
    nodeData: null,
    userBookings: null,
    calendarDate: new Date(),
    selectedBooking: null,
    filterParams: filterParams,
    capacityParams: capacityParams,
    floorParam: 'all',
    availabilityParam: null,
    filteredData: null,
    checked: null,
    currentNode: null,
    error: null,
    disableRecurring: true
  }

  // Pass supplied first name, lastname, email & password to the signUp function, returns the user's token
  onSignUp = ({ firstName, lastName, email, password }) => {
    signUp({ firstName, lastName, email, password }).then(decodedToken => {
      this.setState({ decodedToken })
    })
  }

  // Pass supplied email & password to the signIn function, returns the users token
  onSignIn = ({ email, password }) => {
    signIn({ email, password }).then(decodedToken => {
      this.setState({ decodedToken })
    })
  }

  // Removes the current token from local storage
  onSignOut = () => {
    signOut()
    this.setState({ decodedToken: null })
  }

  setCalendarDate = date => {
    this.setState({ calendarDate: date })
  }

  onShowBooking = booking => {
    const selectedBooking = booking
    console.log('selectedBooking', selectedBooking)
    this.setState(() => ({ selectedBooking }))
  }

  onCloseBooking = () => {
    this.setState(() => ({ selectedBooking: null }))
  }

  // Makes a booking by updating the database and the React state
  onMakeBooking = ({ startDate, endDate, businessUnit, purpose, nodeId, recurringData }) => {
    const bookingData = { startDate, endDate, businessUnit, purpose, nodeId }
    const existingBookings = this.state.currentNode.bookings

    // Check if there is a clash and, if not, save the new booking to the database
    try {
      makeBooking(
        { startDate, endDate, businessUnit, purpose, nodeId, recurringData },
        existingBookings
      )
        .then(updatedNode => {
          // If the new booking is successfully saved to the database
          alert(`${updatedNode.name} successfully booked.`)
          updateStateNode(this, updatedNode, this.loadMyBookings)
        })
    } catch (err) {
      // If there is a booking clash and the booking could not be saved
      alert(
        'Your booking could not be saved. Please ensure it does not clash with an existing booking and that it is a valid time in the future.'
      )
      console.log(err)
    }
  }

  // Deletes a booking from the database and updates the React state
  onDeleteBooking = (nodeId, bookingId) => {
    deleteBooking(nodeId, bookingId)
      .then(updatedNode => {
        alert('Booking successfully deleted')
        updateStateNode(
          this,
          updatedNode,
          this.loadMyBookings,
        )
      })
      .catch(error => console.error(error.message))
  }

  setNode = id => {
    const node = this.state.nodeData.find(node => node._id === id)
    this.setState({ currentNode: node })
  }

  // setting the feature filter parameters
  onToggleFeature = feature => {
    // Get the filter parameters
    let filterParams = this.state.filterParams
    // Find the filter parameter that matches the the passed parameter
    let featureParam = filterParams.find(param => param.name === feature)
    // Toggle the value of the parameter, eg if false, set to true
    featureParam.value = !featureParam.value
    // Set state with the updated filter parameters
    this.setState({ filterParams: filterParams })
  }

  // setting the capacity filter parameters
  onToggleCapacity = capacity => {
    // Get the capacity parameters
    let capacityParams = this.state.capacityParams
    // Find the capacity parameter that matches the the passed parameter
    let capacityParam = capacityParams.find(param => param.id === capacity)
    // Toggle the value of the parameter, eg if false, set to true
    capacityParam.value = !capacityParam.value
    // Set state with the updated capacity parameters
    this.setState({ capacityParams: capacityParams })
  }

  // changing the boolean value for the display attribute for the recurring date input
  onToggleRecurring = (value) => {
    let disableRecurring
    if (value === 'none') {
      disableRecurring = true
    } else {
      disableRecurring = false
    }
    this.setState({disableRecurring: disableRecurring})
  }

  onSetFloorParam = value => {
		this.setState({ floorParam: value })
  }

  onSetAvailabilityParam = availability => {
    this.setState({ availabilityParam: availability })
  }

  // get today's bookings for all nodes
  oneSetCurrentDateBookings = () => {
    const currentDate = moment().format('DD-MM-YYYY')
    // const nodeData = this.state.nodeData
    const nodeData = this.state.nodeData
    // array to collect todays bookings
    let todaysBookings = []
    // loop through all nodes
    nodeData.forEach(node => {
      // loop through all bookings for that node
      node.bookings.forEach(booking => {
        const bookingStart = moment(booking.bookingStart).format('DD-MM-YYYY')
        if (bookingStart === currentDate) {
          todaysBookings.push(booking)
        }
      })
    })
    console.log('todays bookings:', todaysBookings)
    // return todaysBookings
  }

  loadMyBookings = () => {
    let myBookings = []
    const userId = this.state.decodedToken.sub
    // Loop through all the nodes
    this.state.nodeData.forEach(node => {
      // Loop through all the bookings in 'node'
      node.bookings.forEach(booking => {
        if (booking.user === userId) {
          // Push all bookings where the current userId is equal to the booking's userId into myBookings
          booking.nodeId = node._id
          myBookings.push(booking)
        }
      })
    })
    this.setState({ userBookings: myBookings })
  }

  render() {
    const {
      decodedToken,
      currentNode,
      userBookings,
      nodeData,
      calendarDate,
      selectedBooking,
      filterParams,
      capacityParams,
      floorParam,
      availabilityParam,
      disableRecurring,
      loading
    } = this.state
    const signedIn = !!decodedToken
    const signOut = this.onSignOut
    const loadMyBookings = this.loadMyBookings
    const onDeleteBooking = this.onDeleteBooking
    const setCalendarDate = this.setCalendarDate
    const Loading = require('react-loading-animation')

    let filteredData = []
    const featureParams = this.state.filterParams
    const date = this.state.currentDate

    if (!!nodeData) {
      // Send all node data and the selected floor, return filtered floors and store in filteredData
      filteredData = onFilterByFloor(floorParam, nodeData)
      // Send the previously filtered data along with the feature params
      filteredData = onFilterByFeature(featureParams, filteredData)
      // Send the previously filtered data along with the capacity params
      filteredData = onFilterByCapacity(capacityParams, filteredData)
      // Send the previously filtered data along with the availability
      filteredData = onFilterByAvailablity(availabilityParam, filteredData)
    }

    const requireAuth = render => () =>
      signedIn ? render() : <Redirect to="/" />

    return (
      <Router>
        <div id="app" className="App">
          <Fragment>
              <Switch>
                <Route path="/" exact render={() => (!!decodedToken && signedIn ?
                  (<Redirect to="/bookings" />) :
                  (<div className="wrapper__form">
                      <div className="header__page">
                        <h2 className="header__heading header__heading--sub--alt">Sign in with email</h2>
                      </div>
                      <SignInForm onSignIn={this.onSignIn} />
                      <h3 className="header__heading header__heading--sub--alt">Don't have an account?</h3>
                      <SignUpForm onSignUp={this.onSignUp} />
                    </div>
                  )
                )} />

                <Route path="/bookings" exact render={requireAuth(() => (
                  <Fragment>
                    { !!decodedToken && !nodeData && loading && (
                      <div className="loading_animation">
                        <Loading />
                      </div>
                    ) }
                    {!!decodedToken && !!nodeData && !loading && (
                      <div className="wrapper">
                        <div className="header header__nav header--flex">
                          <h1 className="header__heading header__heading--main">Company Name Here</h1>
                          <NavBar
                            signOut={signOut}
                            loadMyBookings={loadMyBookings}
                            user={signedIn ? decodedToken.sub : null}
                          />
                        </div>
                        <div className="wrapper__content">
                          <div className="header__page">
                            <h2 className="header__heading header__heading--sub">Book a node | {moment(calendarDate).format('MMMM Do YYYY')}</h2>
                          </div>
                          <div className="sidebar">
                            <div className="sidebar__box">
                              <Calendar setCalendarDate={setCalendarDate} />
                            </div>
                            <div className="sidebar__box">
                              <FilterElement
                                onSetFloorParam={this.onSetFloorParam}
                                onToggleFeature={this.onToggleFeature}
                                onToggleCapacity={this.onToggleCapacity}
                                onSetAvailabilityParam={
                                  this.onSetAvailabilityParam
                                }
                                filterParams={filterParams}
                                capacityParams={capacityParams}
                                floorParam={floorParam}
                                availabilityParam={availabilityParam}
                                onSetTimeFilterParams={this.onSetTimeFilterParams}
                                date={calendarDate}
                              />
                            </div>
                            <div className="sidebar__box">
                              <Key />
                            </div>
                          </div>
                          <div className="content">
                            <NodesList
                              nodes={filteredData}
                              onNodeSelect={this.onNodeSelect}
                              onShowBooking={this.onShowBooking}
                              date={calendarDate}
                              onSetNode={this.setNode}
                            />
                          </div>
                         </div>
                        <BookingModal
                          selectedBooking={selectedBooking}
                          onCloseBooking={this.onCloseBooking}
                          onDeleteBooking={onDeleteBooking}
                          nodeData={nodeData}
                          user={decodedToken.email}
                        />
                      </div>
                    )}
                  </Fragment>
                ))} />

                <Route path="/createbooking" exact render={requireAuth(
                  () => (
                    <Fragment>
                      {!!decodedToken &&
                        !!nodeData &&
                        !!currentNode && (
                          <div className="wrapper">
                            <header className="header header__nav header--flex">
                              <h1 className="header__heading header__heading--main">Company Name Here</h1>
                              <NavBar
                                signOut={signOut}
                                loadMyBookings={loadMyBookings}
                                user={signedIn ? decodedToken.sub : null}
                              />
                            </header>
                            <div className="wrapper__content">
                              <BookingForm
                                user={decodedToken.email}
                                nodeData={currentNode}
                                onMakeBooking={this.onMakeBooking}
                                date={calendarDate}
                                disableRecurring={disableRecurring}
                                updateCalendar={setCalendarDate}
                                onShowBooking={this.onShowBooking}
                                onToggleRecurring={this.onToggleRecurring}
                              />
                            </div>
                              <BookingModal
                                selectedBooking={selectedBooking}
                                onCloseBooking={this.onCloseBooking}
                                onDeleteBooking={onDeleteBooking}
                                nodeData={nodeData}
                                user={decodedToken.email}
                              />
                        </div>
                      )}
                    </Fragment>
                  )
                )} />

                <Route path="/mybookings" exact render={requireAuth(() => (
                    <Fragment>
                      {!!decodedToken &&
                        !!nodeData && (
                          <div className="wrapper">
                            <div className="header header__nav header--flex">
                              <h1 className="header__heading header__heading--main">Company Name Here</h1>
                              <NavBar
                                signOut={signOut}
                                loadMyBookings={loadMyBookings}
                                user={signedIn ? decodedToken.sub : null}
                              />
                            </div>
                            <div className="wrapper__content--bookings">
                              <div className="header__page">
                                <h2 className="header__heading header__heading--sub">My Bookings</h2>
                              </div>
                              <MyBookings
                                nodeData={nodeData}
                                user={decodedToken.email}
                                userBookings={userBookings}
                                onDeleteBooking={onDeleteBooking}
                              />
                            </div>
                          </div>
                        )}
                    </Fragment>
                  ))} />

                <Route render={({ location }) => <h2>
                      {' '}
                      Page Not Found: {location.pathname}{' '}
                    </h2>} />
            </Switch>
          </Fragment>
        </div>
      </Router>
    )
  }

  load() {
    const { decodedToken } = this.state
    const signedIn = !!decodedToken

    if (signedIn) {
      // display loading page
      this.setState({ loading: true })
      // load all of the nodes from the database
      listNodes()
        .then(nodes => {
          this.setState({ nodeData: nodes })
          // load the current user's bookings
          this.loadMyBookings()
          // the state's current node defaults to first node
          const node = this.state.nodeData[0]
          this.setNode(node._id)
          // toggle loading page off
          this.setState({ loading: false })
        })
        .catch(error => {
          console.error('Error loading node data', error)
          this.setState({ error })
        })
    }
  }

  // When the App first renders
  componentDidMount() {
    this.load()
  }

  // When state changes
  componentDidUpdate(prevProps, prevState) {
    // If just signed in, signed up, or signed out,
    // then the token will have changed
    if (this.state.decodedToken !== prevState.decodedToken) {
      this.load()
    }
  }

}

export default App
