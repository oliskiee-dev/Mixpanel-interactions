class AnnouncementPage {
    // Selectors based on your actual component
    elements = {
      createPostButton: () => cy.contains('button', 'Create Post'),
      announcementCards: () => cy.get('.announcement-card'),
      titleInput: () => cy.get('#announcement-title'),
      descriptionInput: () => cy.get('#announcement-description'),
      postButton: () => cy.contains('button', 'Post Announcement'),
      updateButton: () => cy.contains('button', 'Update Announcement'),
      confirmDeleteButton: () => cy.contains('button', 'Yes, Delete'),
      successMessage: () => cy.get('.toast-message.show'),
      
      // Based on your component structure
      editButtons: () => cy.get('.edit-btn'),
      deleteButtons: () => cy.get('.delete-btn'),
      modalContainer: () => cy.get('.modal-container')
    };
    
    visit() {
        // Navigate to your app's announcement page with the full URL path
        cy.visit('/admin/ManageAnnouncement');
        
        // Wait for content to ensure the page is loaded
        cy.contains('School Announcement Management', { timeout: 10000 }).should('be.visible');
      }
    clickCreatePost() {
      this.elements.createPostButton().click();
      this.elements.modalContainer().should('be.visible');
    }
    
    enterTitle(title) {
      this.elements.titleInput().clear().type(title);
    }
    
    enterDescription(description) {
      this.elements.descriptionInput().clear().type(description);
    }
    
    clickPostAnnouncement() {
      this.elements.postButton().click();
    }
    
    clickEditOnFirstAnnouncement() {
      this.elements.editButtons().first().click();
      this.elements.modalContainer().should('be.visible');
    }
    
    clickDeleteOnFirstAnnouncement() {
      this.elements.deleteButtons().first().click();
    }
    
    confirmDelete() {
      this.elements.confirmDeleteButton().click();
    }
    
    verifyAnnouncementExists(title) {
      cy.contains('.card-title', title).should('be.visible');
    }
    
    verifyAnnouncementRemoved(title) {
      cy.contains('.card-title', title).should('not.exist');
    }
    
    verifySuccessMessage() {
      this.elements.successMessage().should('be.visible');
    }
  }
  
  export default AnnouncementPage;