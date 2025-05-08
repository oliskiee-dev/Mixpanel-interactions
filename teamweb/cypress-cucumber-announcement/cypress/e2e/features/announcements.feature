Feature: Announcement Management
  As a school administrator
  I want to manage announcements
  So that I can communicate information to students and staff

  Background:
    Given I am logged in as an administrator
    And I navigate to the Manage Announcement page

  Scenario: Create a new announcement
    When I click on the "Create Post" button
    And I enter "Test Announcement Title" as the announcement title
    And I enter "This is a test announcement description" as the announcement description
    And I click the "Post Announcement" button
    Then I should see a success message
    And I should see the announcement with title "Test Announcement Title" in the list

  Scenario: Edit an existing announcement
    Given there is at least one announcement
    When I click the "Edit" button on the first announcement
    And I enter "Updated Announcement Title" as the announcement title
    And I click the "Update Announcement" button
    Then I should see a success message
    And I should see the announcement with title "Updated Announcement Title" in the list

  Scenario: Delete an announcement
    Given there is at least one announcement
    When I click the "Delete" button on the first announcement
    And I click the "Yes, Delete" button in the confirmation dialog
    Then I should see a success message
    And the announcement should be removed from the list