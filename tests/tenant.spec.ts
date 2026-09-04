import { test, expect } from '@playwright/test';

// Consi and Pekárna Novák are two different customers on the same platform.
// Neither may ever see the other's data.

test.beforeEach(async ({ request }) => {
  await request.post('/api/_reset');
});

test('Consi cannot see stock items belonging to Pekárna Novák', async ({ page }) => {
  await page.goto('/?token=tok-consi');
  await expect(page.locator('[data-testid="stock-row"]').first()).toBeVisible();

  await expect(page.getByText('Máslo 82% tuku')).toHaveCount(0);
  await expect(page.getByText('Rohlík tukový 43g')).toHaveCount(0);
});

test('Pekárna Novák cannot see stock items belonging to Consi', async ({ page }) => {
  await page.goto('/?token=tok-novak');
  await expect(page.locator('[data-testid="stock-row"]').first()).toBeVisible();

  await expect(page.getByText('Mouka pšeničná hladká T530')).toHaveCount(0);
  await expect(page.getByText('Chléb konzumní kmínový 1200g')).toHaveCount(0);
});

test('no rows from another tenant are rendered in the item list', async ({ page }) => {
  await page.goto('/?token=tok-consi');
  await expect(page.locator('[data-testid="stock-row"]').first()).toBeVisible();

  await expect(
    page.locator('[data-testid="stock-row"][data-tenant="pekarna-novak"]')
  ).toHaveCount(0);
});

test('a request without a token is rejected', async ({ request }) => {
  const res = await request.get('/api/stock-items');
  expect(res.status()).toBe(401);
});
