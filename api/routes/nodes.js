const express = require('express')
const moment = require('moment')
const momentTimezone = require('moment-timezone')
const Node = require('../models/Nodes')
const { requireJWT } = require('../middleware/auth')

const router = new express.Router()

router.get('/nodes', requireJWT, (req, res) => {
  Node.find()
    .then(nodes => {
      res.json(nodes)
    })
    .catch(error => {
      res.json({ error })
    })
})

router.post('/nodes', requireJWT, (req, res) => {
  Node.create(req.body)
    .then(node => {
      res.status(201).json(node)
    })
    .catch(error => {
      res.status(400).json({ error })
    })
})

// Function to convert UTC JS Date object to a Moment.js object in AEST
const dateAEST = date => {
  return momentTimezone(date).tz('Asia/Shanghai')
}

// Function to calculate the duration of the hours between the start and end of the booking
const durationHours = (bookingStart, bookingEnd) => {
  // convert the UTC Date objects to Moment.js objeccts
  let startDateLocal = dateAEST(bookingStart)
  let endDateLocal = dateAEST(bookingEnd)
  // calculate the duration of the difference between the two times
  let difference = moment.duration(endDateLocal.diff(startDateLocal))
  // return the difference in decimal format
  return difference.hours() + difference.minutes() / 60
}

// Make a booking
router.put('/nodes/:id', requireJWT, (req, res) => {
  const { id } = req.params

  // If the recurring array is empty, the booking is not recurring
  if (req.body.recurring.length === 0) {
    Node.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          bookings: {
            user: req.user,
            // The hour on which the booking starts, calculated from 12:00AM as time = 0
            startHour: dateAEST(req.body.bookingStart).format('H.mm'),
            // The duration of the booking in decimal format
            duration: durationHours(req.body.bookingStart, req.body.bookingEnd),
            // Spread operator for remaining attributes
            ...req.body
          }
        }
      },
      { new: true, runValidators: true, context: 'query' }
    )
      .then(node => {
        res.status(201).json(node)
      })
      .catch(error => {
        res.status(400).json({ error })
      })

  // If the booking is a recurring booking
  } else {
    
    // The first booking in the recurring booking range
    let firstBooking = req.body
    firstBooking.user = req.user    
    firstBooking.startHour = dateAEST(req.body.bookingStart).format('H.mm')
    firstBooking.duration = durationHours(req.body.bookingStart, req.body.bookingEnd)
    
    // An array containing the first booking, to which all additional bookings in the recurring range will be added
    let recurringBookings = [ firstBooking ]
    
    // A Moment.js object to track each date in the recurring range, initialised with the first date
    let bookingDateTracker = momentTimezone(firstBooking.bookingStart).tz('Asia/Shanghai')
    
    // A Moment.js date object for the final booking date in the recurring booking range - set to one hour ahead of the first booking - to calculate the number of days/weeks/months between the first and last bookings when rounded down
    let lastBookingDate = momentTimezone(firstBooking.recurring[0]).tz('Asia/Shanghai')
    lastBookingDate.hour(bookingDateTracker.hour() + 1)
    
    // The number of subsequent bookings in the recurring booking date range 
    let bookingsInRange = req.body.recurring[1] === 'daily' ? 
                          Math.floor(lastBookingDate.diff(bookingDateTracker, 'days', true)) :
                          req.body.recurring[1] === 'weekly' ?
                          Math.floor(lastBookingDate.diff(bookingDateTracker, 'weeks', true)) :
                          Math.floor(lastBookingDate.diff(bookingDateTracker, 'months', true))

    // Set the units which will be added to the bookingDateTracker - days, weeks or months
    let units = req.body.recurring[1] === 'daily' ? 'd' : 
                req.body.recurring[1] === 'weekly' ? 'w' : 'M'
    
    // Each loop will represent a potential booking in this range 
    for (let i = 0; i < bookingsInRange; i++) {
      
      // Add one unit to the booking tracker to get the date of the potential booking
      let proposedBookingDateStart = bookingDateTracker.add(1, units)
    
      // Check whether this day is a Sunday (no bookings on Sundays)
      if (proposedBookingDateStart.day() !== 0) {
        
        // Create a new booking object based on the first booking 
        let newBooking = Object.assign({}, firstBooking)
        
        // Calculate the end date/time of the new booking by adding the number of units to the first booking's end date/time
        let firstBookingEndDate = momentTimezone(firstBooking.bookingEnd).tz('Asia/Shanghai')
        let proposedBookingDateEnd = firstBookingEndDate.add(i + 1, units)
        
        // Update the new booking object's start and end dates
        newBooking.bookingStart = proposedBookingDateStart.toDate()
        newBooking.bookingEnd = proposedBookingDateEnd.toDate()
        
        // Add the new booking to the recurring booking array
        recurringBookings.push(newBooking)
      }
    }
    

    // Find the relevant node and save the bookings
    Node.findByIdAndUpdate(
      id,
      {
        $push: {
          bookings: {
            $each:
            recurringBookings
          }
        }
      },
      { new: true, runValidators: true, context: 'query' }
    )
      .then(node => {
        res.status(201).json(node)
      })
      .catch(error => {
        res.status(400).json({ error })
      })
  }
})

// Delete a booking
router.delete('/nodes/:id/:bookingId', requireJWT, (req, res) => {
  const { id } = req.params
  const { bookingId } = req.params
  Node.findByIdAndUpdate(
    id,
    { $pull: { bookings: { _id: bookingId } } },
    { new: true }
  )
    .then(node => {
      res.status(201).json(node)
    })
    .catch(error => {
      res.status(400).json({ error })
    })
})

module.exports = router
