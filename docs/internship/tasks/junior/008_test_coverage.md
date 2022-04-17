# Test Coverage

**Category**: Python Backend Development

**Level:** Junior

**Tag:** v0.0.1 

## Description
There is a set of tests for the Varcade Games web server that verify the account creation functionality.

These tests can be found in `website/server/test/game_portal/accounts/test_accounts.py`.

There is a test that verifies that the system returns an error if you try to create a user with a password that is not strong enough: `test_create_user_with_short_password`.

We do not, however, have a test that verifies that the system will return an error if you supply an invalid email address.

We need to add a new test called `test_create_user_with_invalid_email`. This test should verify that an error is returned if you supply an invalid email (eg: this would not be a valid email: 'myname-at-email.com').

## Deliverable
1. A new tests that verifies that the system returns an error if a user tries to create a new account with an invalid email address 

## Acceptance Criteria
* The new test runs as part of the test suite and passes


***

## Task Tips!
* This new test will be very similar to the existing test for valid password, you should be able to use most of that logic for the new test, though the setup assertions will be a bit different
