import { test, expect } from '@playwright/test';

const CONSI = '/?token=tok-consi';

test('a new flour batch can be received', async ({ page }) => {
  await page.goto(CONSI);
  await expect(page.locator('[data-testid="stock-row"]').first()).toBeVisible();

  await page.getByTestId('receipt-item').selectOption({ label: 'Mouka pšeničná hladká T530' });
  await page.getByTestId('receipt-lot').fill('L2026-0901-X');
  await page.getByTestId('receipt-qty').fill('150');
  await page.getByTestId('receipt-expiry').fill('2027-01-15');
  await page.getByTestId('receipt-submit').click();

  await expect(page.getByTestId('flash')).toContainText('naskladněna');
});

test('the received batch appears in the batch table', async ({ page }) => {
  await page.goto(CONSI);

  await expect(page.locator('[data-testid="batch-row"]')).toHaveCount(5);
  await expect(page.getByText('L2026-0901-X')).toBeVisible();
});

test('receiving a negative quantity is rejected', async ({ page }) => {
  await page.goto(CONSI);
  await expect(page.locator('[data-testid="stock-row"]').first()).toBeVisible();

  await page.getByTestId('receipt-qty').fill('-40');
  await page.getByTestId('receipt-expiry').fill('2027-01-15');
  await page.getByTestId('receipt-submit').click();

  await expect(page.getByTestId('flash')).toContainText('Chyba');
});


test('an expired batch is highlighted in the batch table', async ({ page }) => {
  await page.goto(CONSI);

  const yeastRow = page.locator('[data-batch="b-002"]');
  await expect(yeastRow.locator('.expired')).toBeVisible();
});
