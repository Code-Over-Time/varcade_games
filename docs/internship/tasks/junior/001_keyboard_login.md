# Keyboard Shortcuts

**Category**: Web Frontend Development

**Level:** Junior

**Tag:** v0.0.1 

## Description

The current login / registration form implementation does not support submitting the form by hitting the `return` key.

Players should be able to login / register as follows:

1. Load page
2. Keyboard focus should default to the email field
3. Once email is filled out players can hit `tab` to move to the password field
4. Once the password is filled out players should be able to hit `return` to log in

## Deliverable

Update the game portal client so that:

1. Keyboard focus will automatically be set to the email field of the login form when the homepage is loaded
2. The login form is submitted when a player presses enter while keyboard focus is on the username or password field
    - Note: The submit button will be disabled if the form fields contain invalid data, which should also be the case when return is hit on the keyboard
3. The register form is submitted when a player presses enter while keyboard focus is on one of the registration fields

## Acceptance Criteria

* Hitting the return key on the keyboard must submit the game portal login form when either field has keyboard focus and both fields contain valid data
* Hitting the return key on the keyboard must submit the game portal registration form when any field has keyboard focus and all fields contain valid data
* The form is not submitted if invalid information has been entered (currently the submit button is disabled when this is the case)

***

## Task Tips!

* The login/register component is in `website/client/src/components/wp-login-register.vue` - all of the required changes will need to happen here.
