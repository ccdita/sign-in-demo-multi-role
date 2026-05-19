import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Class representing the application login page, with locators and methods for interaction
 */
class LoginPage {

    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly lockedOutErrorMsg: Locator;
    readonly lockedOutText = 'Epic sadface: Sorry, this user has been locked out.';

    /**
     * Instantiates a LoginPage object
     * 
     * @param page object to instantiate the LoginPage with
     */
    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.getByPlaceholder('Username');
        this.passwordField = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.lockedOutErrorMsg = this.page.getByText(this.lockedOutText);
    }

    /**
     * Fills the username field with the given username
     * 
     * @param username to fill the username field with
     */
    async fillUsernameField(username: string) {
        await this.usernameField.fill(username);
    }

    /**
     * Fills the password field with the given password
     * 
     * @param password to fill the password field with
     */
    async fillPasswordField(password: string) {
        await this.passwordField.fill(password);
    }

    /**
     * Logs into the application with the given username and password
     * 
     * @param username to log in with
     * @param password to log in with
     */
    async doLogin(username: string, password: string) {
        await this.fillUsernameField(username);
        await this.fillPasswordField(password);
        await this.loginButton.click();
    }

    /**
     * Checks that the user is logged into the application
     */
    async checkLoggedIn() {
        await expect(this.page).toHaveURL(/.*\/inventory.html/);
    }

    /**
     * Checks that the user is locked out of the application
     */
    async checkLockedOut() {
        await expect(this.lockedOutErrorMsg).toBeVisible();
    }
}

export default LoginPage;