Feature: Create Announcement
  As a school administrator
  I want to create new announcements
  So that I can inform students and staff about important information

  Background:
    Given I am logged in as an administrator
    And I navigate to the announcement management page

  Scenario: Create an announcement with all fields populated
    When I click on the "Create Post" button
    Then I should see the create announcement modal
    When I enter "Important School Event" as the announcement title
    And I enter "This is a test announcement with details about the upcoming school event" as the announcement description
    And I upload a test image
    And I click the "Post Announcement" button
    Then I should see a success message
    And I should see the announcement with title "Important School Event" in the list