// 1) បង្កើត Firebase project នៅ https://console.firebase.google.com/
// 2) Add a Web App ហើយយក firebaseConfig មកដាក់ខាងក្រោម.
// 3) បញ្ចូល UID របស់ Admin ក្នុង adminUids បន្ទាប់ពីបង្កើត Admin account.
export const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const adminUids = [
  "PASTE_ADMIN_USER_UID_HERE"
];

// ព័ត៌មានទទួលប្រាក់ — កែជាព័ត៌មានផ្លូវការរបស់អ្នក មុនដាក់ប្រើប្រាស់។
export const paymentConfig = {
  khqrImageUrl: "assets/your-khqr.png",
  khqrAccountName: "YOUR KHQR ACCOUNT NAME",
  abaAccountName: "YOUR ABA ACCOUNT NAME",
  abaAccountNumber: "YOUR ABA ACCOUNT NUMBER",
  telegram: "https://t.me/YOUR_TELEGRAM"
};
