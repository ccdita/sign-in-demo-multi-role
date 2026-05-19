import { type Page, type Locator, expect } from '@playwright/test';

class InventoryPage {

    readonly page: Page;
    readonly inventoryList: Locator;
    readonly firstListItem: Locator;
    readonly firstItemLink: Locator;
    readonly firstItemPageTitle: Locator;
    readonly firstItemPageDesc: Locator;
    readonly addToCartButton: Locator;
    firstItemLinkText: any;
    firstItemInventoryDesc: any;

    constructor(page: Page) {
        this.page = page;
        /**
         * Get the inventory list container using a custom test ID attribute
         * - The custom test ID attribute can be defined in playwright.config.ts
         */
        this.inventoryList = this.page.getByTestId('inventory-item'); // Get all elements with the specified test ID
        // Get the first item
        this.firstListItem = this.inventoryList.first();
        this.firstItemLink = this.firstListItem.getByTestId(/.*title-link/);
        this.firstItemPageTitle = this.page.getByTestId('inventory-item-name'); // Item page title
        this.firstItemPageDesc = this.page.getByTestId('inventory-item-desc'); // Item page description
        // Add to Cart button
        this.addToCartButton = this.firstListItem.getByRole('button', { name: 'Add to cart' });
        /**
         * It is NOT advisable to put Playwright actions like below in the constructor
         * - innerText() executes immediately when the page object is created
         * - When innerText() executes, the page may still be loading, the user may not yet be logged in,
         * and/or the locator may not yet exist
         */
        // this.firstItemLinkText = this.firstItemLink.innerText();
        // this.firstItemInventoryDesc = this.firstListItem.getByTestId('inventory-item-desc').innerText();
    }

    /**
     * Unwraps promises for getting the first item link and description texts
     */
    async unwrapPromises() {
        this.firstItemLinkText = await this.firstItemLink.innerText();
        this.firstItemInventoryDesc = await this.firstListItem.getByTestId('inventory-item-desc').innerText();
    }

    /**
     * Clicks the first item link in the inventory page
     */
    async clickFirstItemLink() {
        this.unwrapPromises(); // Get the link and description texts first
        await this.firstItemLink.click();
    }

    /**
     * Checks that the first item page matches the first item listed in the inventory page
     */
    async checkFirstItemPage() {
        await expect(this.firstItemPageTitle).toHaveText(this.firstItemLinkText);
        await expect(this.firstItemPageDesc).toHaveText(this.firstItemInventoryDesc);
    }
}

export default InventoryPage;