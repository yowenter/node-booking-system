import React from 'react'
import moment from 'moment'
import api from './init'

export function listNodes() {
  return api.get('/nodes').then(res => res.data)
}
