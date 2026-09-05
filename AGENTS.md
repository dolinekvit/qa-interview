## Playwright test conventions
Rules for writing and modifying tests in this repository. Follow them exactly. When a rule cannot be followed exactly, leave a comment in the test saying why.

### Locators
Use locators by priority
```
1. page.getByRole
2. page.getByLabel
3. page.getByText
4. page.getByPlaceholder
5. page.getByAltText
6. page.getByTitle
7. page.getByTestId
```

Use CSS/XPath locators only if other locators cannot be applied.

### General rules
1. Never use `page.waitForTimeout()` - use either `toBeVisible()` or `page.waitForUrl()`
2. Isolate every test - do not share state, do not rely on execution order dependencies
3. Use web-first assertions
4. One behavior per test

[Best practices](https://playwright.dev/docs/best-practices) have to be followed.


