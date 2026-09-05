#### Task 1
- `tenant.spec.ts`
- - Tenant tests are exercising 3 scenarios with tokens set and one API test. No UI test is present for when token is not set.
- - Test `no rows from another tenant are rendered in the item list` is falsely reassuring since `data-tenant` is not present anywhere.

- `stock.spec.ts`
- - First test `stock item list loads for the signed-in tenant` implements `waitForTimeout` which can cause flakiness. The better option would be implement `toBeVisible` for table row as is in `tenant.spec.ts`.
- - Test `an expired batch is highlighted in the batch table` uses CSS locator which is not a mistake but least preferred method of getting an element. The easiest fix would be to get the element using testid data attribute.

- `receipt.spec.ts`
- - Seeding is not being reset which will cause flakiness if the spec runs more than once.

- All three files are mixing `page.locator('[data-testid=...]')` and `page.getByTestId`. Latter is recommended.



