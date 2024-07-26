import React from 'react'
import moment from 'moment'
import momentTimezone from 'moment-timezone'
import Button from './Button'
import { findNodeInfo } from '../helpers/bookingForm.js'

function BookingElement({
  bookingData,
  onDeleteBooking,
  nodeData
}) {

  const nodeInfo = findNodeInfo(bookingData.nodeId, nodeData)
  const startTime = momentTimezone.tz(bookingData.bookingStart, 'Asia/Shanghai').format('h.mma')
  const endTime = momentTimezone.tz(bookingData.bookingEnd, 'Asia/Shanghai').format('h.mma')

  return (
    <div className="booking__box">
      <div className="booking__innerbox--left">
        <h3 className="header__heading--sub--alt header__heading--small">{moment(bookingData.bookingStart).format('dddd, MMMM Do YYYY')}</h3>
        <p>{bookingData.businessUnit}</p>
        <p>{bookingData.purpose}</p>
      </div>
      <div className="booking__innerbox--middle">
        <p>From {startTime} to {endTime}</p>
        <p>Duration {bookingData.duration}hrs</p>
        <p>Cluster {nodeInfo.cluster}, {nodeInfo.name}</p>
      </div>
      <div className="booking__innerbox--right">
        <Button
          onClick={() => onDeleteBooking(bookingData.nodeId, bookingData._id)}
          text={`Delete`}
        />
      </div>
    </div>
  )
}

export default BookingElement