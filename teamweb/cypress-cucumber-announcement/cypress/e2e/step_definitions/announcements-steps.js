// cypress/e2e/step_definitions/announcement-steps.js
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Background steps
Given('I am logged in as an administrator', () => {
    // First visit the home page
    cy.visit('http://localhost:5173/');
    
    // Then navigate to the login page
    cy.visit('http://localhost:5173/Login');
    
    // Enter credentials - these appear to be working
    cy.get('input[type="text"]').first().type('Oliver');
    cy.get('input[type="password"]').first().type('Garcia');
    
    // Try several ways to find the login button
    cy.get('button').first().click()
      .then(() => {
        // Wait for navigation to admin homepage, which seems to happen
        cy.url().should('include', '/admin-homepage');
      });
  });
  
 // Add this to cypress/e2e/step_definitions/announcements-steps.js

Given('I navigate to the Manage Announcement page', () => {
    // Navigate to the announcement management page
    cy.visit('http://localhost:5173/manage-announcement');
    
    // Wait for the page to load and data to be fetched
    cy.intercept('GET', '**/announcement*').as('getAnnouncements');
    cy.contains('School Announcement', { timeout: 10000 }).should('be.visible');
    cy.wait('@getAnnouncements');
  });

Given('I navigate to the announcement management page', () => {
  // Navigate to the announcement management page
  cy.visit('http://localhost:5173/admin/manage-announcement');
  
  // Wait for the page to load
  cy.contains('School Announcement Management', { timeout: 10000 }).should('be.visible');
});

// Create scenario steps
When('I click on the {string} button', (buttonText) => {
  cy.contains('button', buttonText).click();
});

When('I enter {string} as the announcement title', (title) => {
  cy.get('#announcement-title').clear().type(title);
});

When('I enter {string} as the announcement description', (description) => {
  cy.get('#announcement-description').clear().type(description);
});

When('I click the {string} button', (buttonText) => {
  cy.contains('button', buttonText).click();
});

// Edit scenario steps
Given('there is at least one announcement', () => {
  // Check if announcements exist, create one if not
  cy.get('body').then(($body) => {
    if ($body.find('.announcement-card').length === 0) {
      // Create a test announcement
      cy.contains('button', 'Create Post').click();
      cy.get('#announcement-title').type('Test Announcement');
      cy.get('#announcement-description').type('This is a test announcement');
      cy.contains('button', 'Post Announcement').click();
      // Wait for the creation to complete
      cy.wait(1000);
    }
  });
});

// Delete scenario steps
When('I click the "Delete" button on the first announcement', () => {
  cy.get('.delete-btn').first().click();
});

When('I click the "Edit" button on the first announcement', () => {
  cy.get('.edit-btn').first().click();
});

When('I click the "Yes, Delete" button in the confirmation dialog', () => {
  cy.contains('button', 'Yes, Delete').click();
});

// Assertion steps
Then('I should see a success message', () => {
  cy.get('.toast-message.show').should('be.visible');
});

Then('I should see the announcement with title {string} in the list', (title) => {
  cy.contains('.card-title', title).should('be.visible');
});

Then('the announcement should be removed from the list', () => {
  // Store the count before and after
  cy.get('.announcement-card').then(($cards) => {
    const initialCount = $cards.length;
    
    // Wait for operation to complete and reload
    cy.wait(1000);
    cy.reload();
    
    // Verify count decreased
    cy.get('.announcement-card').should('have.length.lessThan', initialCount);
  });
});