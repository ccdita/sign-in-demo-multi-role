import { test as setup, type Page } from '@playwright/test';
import LoginPage from '../pages/login-page';

const standardUserFile = '.auth/standard_user.json';

/**
 * Authenticates as a standard user and stores the authentication state in the specified standardUserFile
 */
setup('Authenticate as standard user', async ({ page }) => {
    const username = process.env.STANDARD_USERNAME!;
    const password = process.env.DEMO_PASSWORD!;
    const loginPage = new LoginPage(page);
    await doLogin(page, loginPage, username, password); // Log into the application with the standard user credentials
    await checkLoggedIn(page, loginPage);

    await page.context().storageState({ path: standardUserFile }); // Store the authentication state
});

/**
 * Attempts to authenticate as a locked out user
 */
setup('Authenticate as a locked out user', async ({ page }) => {
    const username = process.env.LOCKED_OUT_USERNAME!;
    const password = process.env.DEMO_PASSWORD!;
    const loginPage = new LoginPage(page);

    await doLogin(page, loginPage, username, password);
    await checkLockedOut(loginPage);
});

const problemUserFile = '.auth/problem_user.json';

/**
 * Authenticates as a problem user and stores the authentication state in the specified problemUserFile
 */
setup('Authenticate as a problem user', async ({ page }) => {
    const username = process.env.PROBLEM_USERNAME!;
    const password = process.env.DEMO_PASSWORD!;
    const loginPage = new LoginPage(page);

    await doLogin(page, loginPage, username, password);
    await checkLoggedIn(page, loginPage);

    await page.context().storageState({ path: problemUserFile }); // Store the authentication state
});

/**
 * Attempts to authenticate as a nonexistent user
 */
setup('Authenticate as a nonexistent user', async({ page }) => {
    const username = process.env.NONEXISTENT_USERNAME!;
    const password = process.env.DEMO_PASSWORD!;
    const loginPage = new LoginPage(page);

    await doLogin(page, loginPage, username, password);
    await checkInvalidCredentials(loginPage);
});

/**
 * Logs into the application with the given credentials
 * 
 * @param page object for interacting with the login page
 * @param username to login with
 * @param password to login with
 */
async function doLogin(page: Page, loginPage: LoginPage, username: string, password: string) {
    await page.goto('/');
    await loginPage.doLogin(username, password);
}

/**
 * Checks that the login was successful
 * 
 * @param page object for interacting with the login page
 * @param loginPage, page object for the login page
 */
async function checkLoggedIn(page: Page, loginPage: LoginPage) {
    await page.waitForURL(/.*\/inventory.html/);
    await loginPage.checkLoggedIn();
}

/**
 * Checks that the user is locked out and unable to log in
 * 
 * @param loginPage, page object for the login page
 */
async function checkLockedOut(loginPage: LoginPage) {
    await loginPage.checkLockedOut();
}

/**
 * Checks that the user with invalid credentials is unable to log in
 * 
 * @param loginPage, page object for the login page
 */
async function checkInvalidCredentials(loginPage: LoginPage) {
    await loginPage.checkInvalidCredentials();
}
