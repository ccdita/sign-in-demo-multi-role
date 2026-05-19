import { test } from '@playwright/test';
import InventoryPage from '../pages/inventory-page';

let inventoryPage: InventoryPage;

test.use({ storageState: '.auth/standard_user.json' });

/**
 * Navigate to the baseURL and instantiate an InventoryPage object
 * - auth-setup.ts should have already logged into the application as a standard user
 */
test.beforeEach(async ({ page }) => {
    await page.goto('/inventory.html');
});

test.describe('Swag Labs - Profile - Standard User', () => {

    /**
     * Tests that the user is able to navigate to the correct page when clicking
     * the first item in the inventory page
     */
    test('Should navigate to the correct first listing', async ({ page }) => {
        inventoryPage = new InventoryPage(page);
        await inventoryPage.clickFirstItemLink();
        await inventoryPage.checkFirstItemPage();
    });
});