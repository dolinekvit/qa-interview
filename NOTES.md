#### Task 1
- `tenant.spec.ts`
- - Tenant tests are exercising 3 scenarios with tokens set and one API test. No UI test is present for when token is not set.
- - Test `no rows from another tenant are rendered in the item list` is falsely reassuring since `data-tenant` is not present anywhere.

- `stock.spec.ts`
- - First test `stock item list loads for the signed-in tenant` implements `waitForTimeout` which can cause flakiness. The better option would be implement `toBeVisible` for table row as is in `tenant.spec.ts`.
- - Test `an expired batch is highlighted in the batch table` uses CSS locator which is not a mistake but least preferred method of getting an element. The easiest fix would be to get the element using testid data attribute. It should also be among receipt tests.

- `receipt.spec.ts`
- - Seeding is not being reset which will cause flakiness if the spec runs more than once.
- - `a new flour batch can be received` and `the received batch appears in the batch table` should be in the same test.

- All three files are mixing `page.locator('[data-testid=...]')` and `page.getByTestId`. Latter is recommended.

#### Task 2 
- Initialized AGENTS.md with minimalistic rules which agents should follow.
- I have added tests to exercise some of the, in my opinion, critical behaviors. The most important is displaying tenant data without token and with invalid token. Additionally, a new API test has been added to ensure the response does not contain data of other tenants which, at the moment, does.
- Less critical tests focused on translations which are currently missing.
- In case of receipt, I've added tests to exercise form for adding a product. Namely, expedite button should be disabled if quantity reaches 0 and LOT code reusability which should not be possible.
- There is a lot of tests that could be added, eg. receipt item quantity cannot go below 0, expedite button rendered in rows with items that cannot be expedited, and such.

#### Task 3 
- A release-blocking bugs would definitely be shared data in API response, tenant Consi can see data of the other tenant. Additionally, Consi data are viewable even without token which can cause distrust. 
- Other bugs, such as reusability of LOT code and expedite button not being disabled are medium bugs. Localization missing could be considered minor bug.
- There are some things that are definitely missing in the UI and worthy of "creating a ticket" for. Some items have expedition blocked and user has no way of knowing, units are missing from the table but are coming from the API endpoint.
- Reorder threshold is not stated anywhere and in multiple places, the application is showing internal values (such as best_before, used_by).
- A few more things I'd love to discuss during our call if the time allows!


### AI usage
- Since I was not so familiar with Playwright, I had to dig up some best practices, ask AI how to do a couple things (eg. finding element using filter). Another usage was a code review based on said rules.
