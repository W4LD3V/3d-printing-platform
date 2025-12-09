/// <reference types="@wdio/globals/types" />

import { Given, Then, When } from '@wdio/cucumber-framework';
import assert from 'node:assert';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

Given('I am on the login page', async () => {
  await browser.url(`${baseUrl}/login`);
});

When('I sign in with email {string} and password {string}', async (email: string, password: string) => {
  const emailInput = await $('[name="email"], #email');
  await emailInput.setValue(email);
  const passwordInput = await $('[name="password"], #password');
  await passwordInput.setValue(password);
  const submit = await $('button=Sign in');
  await submit.click();
});

Then('I should see the Orders page', async () => {
  await browser.waitUntil(async () => (await browser.getUrl()).includes('/orders'), {
    timeout: 8000,
    timeoutMsg: 'Expected to navigate to orders'
  });
  const heading = await $('h1=Create a print order');
  assert.ok(await heading.isExisting());
});
