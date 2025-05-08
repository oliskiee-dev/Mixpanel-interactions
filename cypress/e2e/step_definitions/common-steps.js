import { Given } from '@badeball/cypress-cucumber-preprocessor';

// Background steps
Given('I am logged in as an administrator', () => {
  // Mock the login state by setting localStorage
  cy.window().then((win) => {
    win.localStorage.setItem('username', 'AdminUser');
  });
});

Given('I navigate to the announcement management page', () => {
  cy.visit('/');
});