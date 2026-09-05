import { test, expect } from '@playwright/test';

const CONSI = '/?token=tok-consi';

test.beforeEach(async ({ request }) => {
  await request.post('/api/_reset');
});

test('stock item list loads for the signed-in tenant', async ({ page }) => {
  await page.goto(CONSI);

  await expect(page.getByTestId('stock-row')).toHaveCount(4);
});

test('flour is shown with all the parameters', async ({ page }) => {
  await page.goto(CONSI);

  const row = page.locator('[data-sku="MOU-T530"]');
  await expect(row.getByTestId('stock-name')).toHaveText('Mouka pšeničná hladká T530');
  await expect(row).toContainText('BATCH');
  await expect(row).toContainText('Ingredience')
  await expect(row).toContainText('Minimální trvanlivost')
});

test('packaging is tracked by quantity, not by batch', async ({ page }) => {
  await page.goto(CONSI);

  const row = page.locator('[data-sku="SAC-PAP-500"]');
  await expect(row).toContainText('QUANTITY');
});

test('an expired batch is highlighted in the batch table', async ({ page }) => {
  await page.goto(CONSI);

  const yeastRow = page.locator('[data-batch="b-002"]');
  await expect(yeastRow.locator('.expired')).toBeVisible();
});
