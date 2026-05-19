# Playwright test suite for authenticating with multiple roles

Welcome! This is a repository of Playwright tests that demonstrate authenticating with multiple user roles using [Swag Labs](https://www.saucedemo.com/), a demo website. This repo contains my solutions to Ch 1, exercises 8 and 9 in the [TAU Advanced Playwright course](https://github.com/ccdita/tau-advanced-playwright).

## What does this test suite demonstrate?

This test suite consists of two types of tests:
- **Roles with their own test file**: Each user role* has its own test file, which contains tests that verify user flows and permissions specific to that user
    - [`profile-stored-auth-standard-user.spec.ts`](`./tests/specs/profile-stored-auth-standard-user.spec.ts`)
    - [`profile-stored-auth-problem-user.spec.ts`](`./tests/specs/profile-stored-auth-problem-user.spec.ts`)
- **A single test file for all roles**: All tests for the user roles are in one test file
    - [`profile-stored-auth-multi-role.spec.ts`](`./tests/specs/profile-stored-auth-multi-role.spec.ts`)

**Excludes invalid users, since the auth setup verifies invalid login already and these users cannot perform essential user flows without logging in. Thus, I did not give these users their own test files.*

## How does each method work?

Both methods assume `auth-setup.ts` has already run:
- `playwright.config.ts` defines `auth-setup.ts` as a project dependency to be run before all tests
- `auth-setup.ts` runs once, authenticating with multiple user roles and storing the authentication state in an `auth` JSON file

**Roles with their own test file:**

- Each user role has its own test file
- Within this test file...
    - The `storageState` file is defined for storing and loading in authentication states specific to the role
    - Tests verify interactions specific to the role

**A single test file for all roles:**

- A single test file contains test cases for multiple user roles
- A single test can verify multiple user roles
- For each user role...
    - A new browser context and page within that browser is made
    - The browser context is given a `storageState` file to store and load in authentication states specific to the role

## How do these methods differ?

| Feature | Multiple Test Files | Single Test File |
| ----- | ----- | ----- |
| **Speed** | Faster (Playwright parallelizes tests by file) | Slower (Tests in a single file typically run sequentially) |
| **Isolation** | High (fresh context per worker) | Lower (must manually configure new browser context and separate workers) |
| **Scalability** | Ideal for large, complex projects | Ideal for smaller projects |

## What are some use cases for either method?

| Multiple Test Files | Single Test File |
| ----- | -----|
| Verifying user flows and permissions in isolation (e.g., an administrator has access to settings that a standard user does not) | Verifying E2E multi-user flows (e.g., a standard user performing an action that the administrator must approve) |
| Verifying one user cannot access another user's private data | Verifying collaborative applications like shared editors |

## References
- [Swag Labs Demo Website](https://www.saucedemo.com/)
- [Get a value from a Promise Typescript on Stack Overflow](https://stackoverflow.com/questions/39032333/get-a-value-from-a-promise-typescript)
- [innerText on Playwright Docs](https://playwright.dev/docs/api/class-locator#locator-inner-text)
- [first on Playwright Docs](https://playwright.dev/docs/api/class-locator#locator-first)
- [Locate by test id on Playwright Docs](https://playwright.dev/docs/locators#locate-by-test-id)