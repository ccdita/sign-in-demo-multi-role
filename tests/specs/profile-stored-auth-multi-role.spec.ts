import { test } from '@playwright/test';
import InventoryPage from '../pages/inventory-page';

let inventoryPage: InventoryPage;

/**
 * Not necessary:
 * - Tests create an entirely different browser context and page
 * - Tests never use this page fixture
 */
// test.beforeEach(async ({ page }) => {
//     await page.goto('/inventory.html');
// });

test.describe('Swag Labs - Profiles', () => {

    /**
     * Why are there no tests for the locked out and nonexistent users?
     * - These tests assume that auth setup has already run, and require an authentication state to
     * restore and validate the login status
     * - Authentication tests for the locked out and nonexistent users are already handled within the
     * auth setup file itself
     */
    test('Standard User and Problem User', async ({ browser }) => {
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
        inventoryPage = new InventoryPage(standardUserPage); // Pass authenticated page into POM
        await inventoryPage.clickFirstItemLink();
        await inventoryPage.checkFirstItemPage();

        // ----- PROBLEM USER -----
        const problemUserContext = await browser.newContext({ storageState: '.auth/problem_user.json' });
        const problemUserPage = await problemUserContext.newPage();
        await problemUserPage.goto('/inventory.html');
        inventoryPage = new InventoryPage(problemUserPage);
        await inventoryPage.clickFirstItemLink();
        await inventoryPage.checkWrongFirstItemPage();
    });
});