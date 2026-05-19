import { test as setup, type Page } from '@playwright/test';
import LoginPage from '../pages/login-page';

const standardUserFile = '.auth/standard_user.json';

/**
 * Authenticates as a standard user and stores the authentication state in the specified standardUserFile
 */
setup('Authenticate as standard user', async ({ page }) => {
    const username = process.env.STANDARD_USERNAME!;
    const password = process.env.DEMO_PASSWORD!;
    await doLogin(page, username, password); // Log into the application with the standard user credentials

    await page.context().storageState({ path: standardUserFile }); // Store the authentication state
});

/**
 * Logs into the application with the given credentials
 * 
 * @param page object for interacting with the login page
 * @param username to login with
 * @param password to login with
 */
async function doLogin(page: Page, username: string, password: string) {
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.doLogin(username, password);
    await page.waitForURL(/.*\/inventory.html/);
    await loginPage.checkLoggedIn();
}