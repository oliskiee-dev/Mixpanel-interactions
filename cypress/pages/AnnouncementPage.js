class AnnouncementPage {
    // Selectors
    elements = {
      // Page elements
      createPostButton: () => cy.contains('button', 'Create Post'),
      announcementCards: () => cy.get('.announcement-card'),
      successToast: () => cy.get('.toast-message.show'),
      
      // Modal elements
      modal: () => cy.get('.modal-container'),
      titleInput: () => cy.get('#announcement-title'),
      descriptionInput: () => cy.get('#announcement-description'),
      fileUploadInput: () => cy.get('input[type="file"]'),
      postButton: () => cy.contains('button', 'Post Announcement'),
    };
    
    // Actions
    visitAnnouncementPage() {
      cy.visit('/');
      // Wait for page to load - adjust selector as needed
      cy.contains('School Announcement Management', { timeout: 10000 });
    }
    
    clickCreatePostButton() {
      this.elements.createPostButton().click();
    }
    
    enterTitle(title) {
      this.elements.titleInput().clear().type(title);
    }
    
    enterDescription(description) {
      this.elements.descriptionInput().clear().type(description);
    }
    
    uploadImage(filePath) {
      this.elements.fileUploadInput().selectFile(filePath, { force: true });
    }
    
    clickPostAnnouncement() {
      this.elements.postButton().click();
      
      // Intercept the API call
      cy.intercept('POST', '**/announcement/add').as('addAnnouncement');
      cy.wait('@addAnnouncement', { timeout: 10000 });
    }
    
    // Validations
    verifyModalIsOpen() {
      this.elements.modal().should('be.visible');
    }
    
    verifyAnnouncementWithTitleExists(title) {
      cy.contains('.card-title', title).should('be.visible');
    }
    
    verifySuccessMessageIsDisplayed() {
      this.elements.successToast().should('be.visible');
    }
  }
  
  export default AnnouncementPage;