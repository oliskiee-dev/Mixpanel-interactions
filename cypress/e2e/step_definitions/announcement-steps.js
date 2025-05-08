import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import AnnouncementPage from '../../pages/AnnouncementPage';

const announcementPage = new AnnouncementPage();

// Create Announcement steps
When('I click on the "Create Post" button', () => {
  announcementPage.clickCreatePostButton();
});

Then('I should see the create announcement modal', () => {
  announcementPage.verifyModalIsOpen();
});

When('I enter {string} as the announcement title', (title) => {
  announcementPage.enterTitle(title);
});

When('I enter {string} as the announcement description', (description) => {
  announcementPage.enterDescription(description);
});

When('I upload a test image', () => {
  announcementPage.uploadImage('cypress/fixtures/test-image.jpg');
});

When('I click the "Post Announcement" button', () => {
  announcementPage.clickPostAnnouncement();
});

Then('I should see a success message', () => {
  announcementPage.verifySuccessMessageIsDisplayed();
});

Then('I should see the announcement with title {string} in the list', (title) => {
  announcementPage.verifyAnnouncementWithTitleExists(title);
});