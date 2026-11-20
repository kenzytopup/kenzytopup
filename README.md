# KENZY TOPUP — Multi Game Top Up Website

Static storefront + Firebase Firestore order storage + Firebase Authentication admin panel.

## Included
- Mobile-friendly storefront (Mobile Legends, Free Fire, PUBG Mobile, Roblox)
- Game ID / Server ID fields
- Package selection and price summary
- KHQR / ABA payment instructions
- Firestore order submission
- Admin login and order status management

## Important before launch
This project is a starter storefront. Package prices are sample values and must be confirmed/updated by the store owner. It does **not** automatically deliver diamonds/UC/Robux and does **not** verify bank payments. Admin must independently confirm each transfer in the bank app before marking an order Paid or Completed. Never ask customers for ABA PIN, password or OTP.

## 1. Create Firebase project (free Spark plan)
1. Open https://console.firebase.google.com/ and create a project.
2. Add a Web App and copy its Firebase config.
3. In **Authentication → Sign-in method**, enable **Email/Password**.
4. In **Authentication → Users**, add your admin email/password.
5. Copy the admin user's UID.
6. In **Firestore Database**, create a database.
7. Paste the Web App config into `firebase-config.js`.
8. Replace `PASTE_ADMIN_USER_UID_HERE` in both `firebase-config.js` and `firestore.rules` with the exact admin UID.
9. Publish the contents of `firestore.rules` in Firestore → Rules.

## 2. Add payment details
- Create folder `assets`.
- Put your merchant KHQR image in `assets/your-khqr.png`.
- Edit `paymentConfig` in `firebase-config.js`:
  - `khqrAccountName`
  - `abaAccountName`
  - `abaAccountNumber`
  - `telegram`
- Use only your own verified merchant QR/account details. The KHQR image is a placeholder until you add yours.

## 3. Update prices
Edit the `games` array at the top of `app.js`. Each package is `[package name, "$price"]`.
Prices in this starter are examples, not live supplier rates.

## 4. Test locally
Because JavaScript modules are used, serve the folder through a local web server (not by opening `index.html` as a file). For example:
- VS Code: install Live Server and click **Go Live**.
- Or run `python -m http.server 8000` in this folder and open `http://localhost:8000`.

## 5. Free hosting with GitHub Pages
1. Create a GitHub repository named `kenzytopup`.
2. Upload `index.html`, `admin.html`, `style.css`, `app.js`, `admin.js`, `firebase-config.js`.
3. In repository Settings → Pages, select **Deploy from a branch**, choose `main` and `/ (root)`.
4. Save and wait for the published Pages URL.
5. Keep the repository public if using GitHub Pages on the free plan.

Firestore rules are deployed separately in Firebase; uploading `firestore.rules` to GitHub does not publish them.

## Security notes
- The Firebase web config is expected to be visible in a browser; Firestore Rules protect the database.
- The admin UID allowlist must match the Firebase Authentication UID exactly in both locations.
- Do not use a shared admin password. Turn on strong account security.
- Do not store card details, ABA PINs, passwords or OTPs.
- Before accepting real orders, test Firestore rules using Firebase Rules Playground / Emulator.
- GitHub Pages hosts only the website files; Firebase provides the database and login.
- Firebase free quotas/terms may change. Monitor usage and billing settings.
