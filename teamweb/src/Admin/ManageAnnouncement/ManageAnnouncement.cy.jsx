import React from 'react'
import ManageAnnouncement from './ManageAnnouncement'

describe('<ManageAnnouncement />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ManageAnnouncement />)
  })
})