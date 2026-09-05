import { test, expect } from '@playwright/test';

const CONSI = '/?token=tok-consi';

test.beforeEach(async ({ request }) => {
  await request.post('/api/_reset');
});

test('a new flour batch can be received', async ({ page }) => {
  await page.goto(CONSI);
  await expect(page.locator('[data-testid="stock-row"]').first()).toBeVisible();

  await page.getByTestId('receipt-item').selectOption({ label: 'Mouka pšeničná hladká T530' });
  await page.getByTestId('receipt-lot').fill('L2026-0901-X');
  await page.getByTestId('receipt-qty').fill('150');
  await page.getByTestId('receipt-expiry').fill('2027-01-15');
  await page.getByTestId('receipt-submit').click();

  await expect(page.getByTestId('flash')).toContainText('naskladněna');
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

test('expedite button is disabled if quantity is 0', async ({ page }) => {
  await page.goto(CONSI)
  const LOT = 'L-EXP-0';

  await page.goto(CONSI);
  await expect(page.getByTestId('stock-row')).toHaveCount(4);

  await page.getByTestId('receipt-item').selectOption({ label: 'Chléb konzumní kmínový 1200g' });
  await page.getByTestId('receipt-lot').fill(LOT);
  await page.getByTestId('receipt-qty').fill('1');
  await page.getByTestId('receipt-expiry').fill('2027-01-15');
  await page.getByTestId('receipt-submit').click();

  const row = page.getByTestId('batch-row').filter({ hasText: LOT });
  await expect(row).toHaveCount(1);
  await expect(row.getByTestId('batch-qty')).toHaveText('1');

  await row.getByTestId('expedite').click();
  await expect(row.getByTestId('batch-qty')).toHaveText('0');

  await expect(row.getByTestId('expedite')).toBeDisabled();
})

test('a lot code cannot be reused for the same item', async ({ page }) => {
  await page.goto(CONSI);

  await page.getByTestId('receipt-item').selectOption({ label: 'Mouka pšeničná hladká T530' });
  await page.getByTestId('receipt-lot').fill('L2026-0812-A');
  await page.getByTestId('receipt-qty').fill('1');
  await page.getByTestId('receipt-expiry').fill('2027-01-15');
  await page.getByTestId('receipt-submit').click();

  await expect(page.getByTestId('flash')).toContainText('Chyba');
});
