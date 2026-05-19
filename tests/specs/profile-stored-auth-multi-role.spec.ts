import { test } from '@playwright/test';
import LoginPage from '../pages/login-page';

let loginPage: LoginPage;

/**
 * Not necessary:
 * - Tests create an entirely different browser context and page
 * - Tests never use this page fixture
 */
// test.beforeEach(async ({ page }) => {
//     await page.goto('/inventory.html');
// });

test.describe('Swag Labs - Profiles', () => {

    test('Multiple roles', async ({ browser }) => {
        // ----- STANDARD USER -----
        /**
         * Create a new browser context, which is akin to a separate browser session with its own:
         * - Cookies
         * - localStorage
         * - sessionStorage
         * - auth state
         * Passing in the storageState allows Playwright to restore a previously-saved auth state
         */
        const standardUserContext = await browser.newContext({ storageState: '.auth/standard_user.json' });
        const standardUserPage = await standardUserContext.newPage(); // Create a new tab/page within the browser
        await standardUserPage.goto('/inventory.html');
        loginPage = new LoginPage(standardUserPage); // Pass authenticated page into POM
        await loginPage.checkLoggedIn();
    });
});