/// <reference types="cypress" />
/// <reference types="../support" />

import SignInPageObject from '../support/pages/signIn.pageObject';
import SettingsPageObject from '../support/pages/settings.pageObject';
import HomePageObject from '../support/pages/home.pageObject';

const signInPage = new SignInPageObject();
const settingsPage = new SettingsPageObject();
const homePage = new HomePageObject();

describe('Settings page', () => {
  beforeEach(() => {
  cy.task('db:clear');

  cy.intercept('GET', '/api/articles*', {
    articles: [],
    articlesCount: 0,
  });

  cy.intercept('GET', '/api/articles/feed*', {
    articles: [],
    articlesCount: 0,
  });

  cy.task('generateUser').then((user) => {
    cy.register(user.email, user.username, user.password);

    signInPage.visit();
    signInPage.typeEmail(user.email);
    signInPage.typePassword(user.password);
    signInPage.clickSignInBtn();

    cy.getByDataCy('settings-link').click();
  });
});

  it('should provide an ability to update username', () => {
    const newUsername = 'updateduser123';

    settingsPage.typeUsername(newUsername);
    settingsPage.clickUpdateSettingsBtn();

    homePage.assertHeaderContainUsername(newUsername);
  });

  it('should provide an ability to update bio', () => {
    const newBio = 'This is my new bio';

    settingsPage.typeBio(newBio);
    settingsPage.clickUpdateSettingsBtn();

    settingsPage.bioField.should('have.value', newBio);
  });

  it('should provide an ability to update an email', () => {
    const newEmail = `test${Date.now()}@mail.com`;

    settingsPage.typeEmail(newEmail);
    settingsPage.clickUpdateSettingsBtn();

    settingsPage.emailField.should('have.value', newEmail);
  });

  it('should provide an ability to update password', () => {
    const newPassword = '12345Qwert!';

    settingsPage.typePassword(newPassword);
    settingsPage.clickUpdateSettingsBtn();

    cy.url().should('include', '/profile/');
  });

  it('should provide an ability to log out', () => {
    settingsPage.clickLogoutBtn();

    cy.url().should('eq', 'http://localhost:3000/');
cy.contains('Sign in').should('be.visible');
  });
});