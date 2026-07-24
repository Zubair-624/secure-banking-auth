# Login/Signup Testing App

A simple Node.js + Express + MySQL app, built as a practice target for manual testing.

## How to Run (in VS Code terminal)

1. Make sure MySQL is installed and running on your machine.
2. Create the database and table:
   ```
   mysql -u root -p < database/schema.sql
   ```
3. Open `.env` and fill in your real MySQL password.
4. Install dependencies:
   ```
   npm install
   ```
5. Start the server:
   ```
   npm start
   ```
6. Open your browser to: http://localhost:3000/signup.html

## What to test (this is Track B — Manual Testing)
Use the test cases from your Manual Testing Script (Google Sheet) against this running app:
- Sign up with valid details → check the `users` table in MySQL for the new row
- Sign up again with the same email → should be rejected (duplicate check)
- Try a password under 8 characters → should be rejected
- Login with correct / incorrect credentials
- Check that `password_hash` column never contains your plain-text password

## Where the "White Box" logic lives
Open `routes/auth.js` — the if/else validation checks there (email format, password length,
duplicate check) are exactly what your White Box test notes should describe, since white box
testing looks at the internal logic, not just the UI.
