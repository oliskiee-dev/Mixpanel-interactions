// Import cypress-file-upload for handling file uploads
import 'cypress-file-upload';

// Add command to handle the toast messages
Cypress.Commands.add('getToast', () => {
  return cy.get('.toast-message.show');
});