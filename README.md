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

## Challenges

**User role tests failing because of no redirects:**
| Topic | Description |
|----- | ----- |
| **Problem** | [`profile-stored-auth-standard-user.spec.ts`](./tests/specs/profile-stored-auth-standard-user.spec.ts) was failing because the user was not logged in |
| **Steps to Investigate** | - Confirmed that the specified `storageState` file exists, and that the path is correct 
| | - Confirmed that the specified `storageState` file actually contains a valid logged-in session |
| | - Confirmed that `auth-setup.ts` runs, because it generated a new `storageState` file when that file was deleted |
| | - Confirmed that both setup and the tests run in the same browser (Chromium) |
| | - Confirmed that the application stores the authentication state in `cookies` |
| **Diagnosis** | After confirming that `auth-setup.ts` *does* store the authentication state and that Playwright reuses this state, I concluded that the issue is because the application does not automatically redirect authenticated users from `/` |
| **Fix** | Changed the `await page.goto('/')` to `await page.goto('/inventory.html')` to manually redirect the authenticated user to the inventory page |

**Unwrapping promises to assign to instance variables:**

| Topic | Description |
|----- | ----- |
| **Problem** | [`inventory-page.ts`](./tests/pages/inventory-page.ts) has instance variables that located elements using methods that returned promises. These promises could not be unwrapped in the constructor since constructors are synchronous (they must fully instatiate the object). I needed to find another way to instantiate the variables |
| **Steps to investigate** | Researched how to unwrap promises for class variables
| **Diagnosis** | Two ways to unwrap a promise are by using `await` in an `async` function and the static factory method
| | - The static factory method involves making the instance variables and constructor private, and creating a method for instantiating the object. The method would unwrap the promises and pass the resolved values to the constructor, which then finishes instantiating the object |
| **Fix** |  For the sake of time, I created an `unwrapPromises()` method that instantiated two of the instance variables, and then called this method in the `clickFirstItemLink()` method. If I had more time, I would implement the static factory method to unwrap the promises |

## Lessons Learned
- Check how the application handles loading in a saved authentication state (e.g., does it automatically redirect?)
- Check how the application stores authentication state (e.g., in `localStorage` or in `cookies`?)
- Using `'/'` instead of `''` to designate the `baseURL` is better practice, as it explicitly states that we are using the root URL (`baseURL`)
- Do not perform Playwright actions in constructors:
    - Contructors cannot be async
    - Locators are lazy (and Playwright actions like `.innerText()` are not lazy)
    - Leave querying elements to class methods (you cannot deliver/construct an object if you don't know that it's complete)
- Promises can be unwrapped using `await` in `async` functions and via the static factory method
- If you want the "nth" item from a list of elements, do not query the container. Using locators to return all elements that match your query, and then getting the "nth" element, is sufficient

## References
- [Swag Labs Demo Website](https://www.saucedemo.com/)
- [Get a value from a Promise Typescript on Stack Overflow](https://stackoverflow.com/questions/39032333/get-a-value-from-a-promise-typescript)
- [innerText on Playwright Docs](https://playwright.dev/docs/api/class-locator#locator-inner-text)
- [first on Playwright Docs](https://playwright.dev/docs/api/class-locator#locator-first)
- [Locate by test id on Playwright Docs](https://playwright.dev/docs/locators#locate-by-test-id)