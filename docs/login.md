## LOGIN: Log in and out

As an inventory manager, I want to log in to the website, so that I can view and manage products.

| ID | Criterion | Status |
|---|---|---|
| LOGIN-1 | Entering valid credentials shows the inventory view. | Draft |
| LOGIN-2 | Entering invalid credentials keeps the user on the login view and shows "Invalid credentials". | Draft |
| LOGIN-3 | A wrong username and a wrong password show the same message. | Open question |
| LOGIN-4 | Submitting with both fields empty keeps the user on the login view and shows "Username and password are required". | Draft |
| LOGIN-5 | SQL text entered in the username or password field is treated as plain text: login is rejected and the user stays on the login view. | Draft |
| LOGIN-6 | Script text entered in the username or password field is treated as plain text: login is rejected and nothing executes. | Draft |
| LOGIN-7 | A logged-in user who reloads the page stays logged in and still sees the inventory view. | Draft |
| LOGIN-8 | Clicking logout shows the login view and the inventory view is no longer visible. | Draft |
| LOGIN-9 | If the session token is removed and the page is reloaded, the user sees the login view. | Draft |

## Open questions for the product owner

- **LOGIN-3:** Must a wrong username and a wrong password show an identical message? The app currently returns the same "Invalid credentials" for both.