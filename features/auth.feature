Feature: Authentication
  Scenario: User logs in with seeded account
    Given I am on the login page
    When I sign in with email "user@example.com" and password "user123"
    Then I should see the Orders page
