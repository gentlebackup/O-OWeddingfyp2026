# Oluwapelumi & Oluwasegun — Wedding RSVP Website

A beautiful, elegant single-page wedding website with RSVP form.

**Wedding Date:** October 17, 2026  
**Venue:** Royal Rex Event Center, Asalu Bus Stop, Ikotun, Abaranje Road  
**RSVP Deadline:** October 10, 2026

---

## Files Included

- `index.html` — Main page
- `styles.css` — All styling
- `script.js` — Countdown, mobile menu, form handling
- `README.md` — This guide

---

## How to Collect RSVPs (Email + Google Sheet)

The form is ready. You just need to connect it so responses go to **both** your email and a Google Sheet.

### Recommended Method: Google Apps Script (100% Free)

#### Step 1: Create a Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like **“Oluwapelumi & Oluwasegun RSVPs”**.
3. In the first row, add these column headers (exactly):

| A       | B     | C      | D    | E       | F        | G         |
|---------|-------|--------|------|---------|----------|-----------|
| Timestamp | Name  | Phone  | Guests | Meal Preference | Message | Donation Support |

#### Step 2: Open Apps Script
1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete any existing code and paste the entire script below:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Add a new row with the form data
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.name || '',
      data.phone || '',
      data.guests || '',
      data.meal || '',
      data.message || '',
      data.donation || ''
    ]);

    // ===== EMAIL NOTIFICATION =====
    // Change this to your real email address
    const YOUR_EMAIL = "your-email@gmail.com";

    const subject = "New Wedding RSVP – Oluwapelumi & Oluwasegun";
    const body = `
New RSVP received!

Name: ${data.name}
Phone: ${data.phone}
Number of Guests: ${data.guests}
Meal Preference: ${data.meal}
Donation Support: ${data.donation}

Message:
${data.message || '(No message)'}

Submitted at: ${data.timestamp}
    `;

    MailApp.sendEmail(YOUR_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: test function
function doGet() {
  return ContentService.createTextOutput("RSVP endpoint is working!");
}
```

3. **Important:** Replace `"your-email@gmail.com"` with the email address where you want to receive notifications.

#### Step 3: Deploy as Web App
1. Click **Deploy → New deployment**.
2. Click the gear icon → select **Web app**.
3. Settings:
   - Description: `Wedding RSVP Form`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**.
5. Authorize the app (you may need to click “Advanced” → “Go to … (unsafe)” — this is normal for personal scripts).
6. Copy the **Web App URL** (it looks like `https://script.google.com/macros/s/AKfycb.../exec`).

#### Step 4: Connect the Website
1. Open `script.js`.
2. Find this line near the top:
   ```js
   const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace it with your Web App URL:
   ```js
   const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```

Done! Every RSVP will now:
- Appear as a new row in your Google Sheet
- Send an email notification to you

---

## How to Host the Website (Free)

### Option 1: Netlify (Easiest)
1. Go to [netlify.com](https://www.netlify.com) and sign up (free).
2. Drag and drop the entire `wedding-rsvp` folder onto Netlify.
3. Your site will be live in seconds with a free `.netlify.app` link.
4. You can later connect a custom domain (e.g. `oluwapelumiandoluwasegun.com`).

### Option 2: Vercel
1. Go to [vercel.com](https://vercel.com).
2. Import the folder or connect a GitHub repo.

### Option 3: GitHub Pages
1. Create a GitHub repository.
2. Upload the files.
3. Go to Settings → Pages → Deploy from main branch.

---

## Updating the Website Later

### Adding Real Photos
1. Replace the Unsplash image URLs in `index.html` (Gallery section and Hero background) with your own photos.
2. Upload your photos to a free service like Imgur, Cloudinary, or simply place them in an `/images` folder and update the paths.

### Changing Colors
Open `styles.css` and edit the variables at the top:

```css
:root {
  --color-gold: #C9A227;     /* Main accent */
  --color-gold-dark: #A8841A;
  --color-ivory: #FDF8F3;
  /* etc. */
}
```

### Editing Text
All content is in `index.html`. You can change the story, timeline, venue details, etc. easily.

---

## Form Fields Collected
- Full Name (required)
- Phone Number (required)
- Number of Guests (required)
- Meal Preference
- Message to the Couple
- Donation Support (optional)

---

With love,  
Ready for your special day 💍

---

## Guest Photo Uploads

Guests can upload their wedding day pictures using a Google Drive folder.

### How to set it up (very easy):

1. Go to [drive.google.com](https://drive.google.com)
2. Create a new folder called **“Wedding Guest Photos – Oluwapelumi & Oluwasegun”**
3. Right-click the folder → **Share**
4. Under General access, choose **Anyone with the link**
5. Change the role to **Editor** (so people can upload)
6. Click **Copy link**
7. Open `index.html` and find this line:
   ```html
   <a href="https://drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE"
   ```
8. Replace the whole link with the one you copied from Google Drive.

Now when guests click “Upload Photos Here”, they can add pictures directly into your folder. You can download everything easily from Google Drive later.

---

## Donation Account Details

Already added on the website:

- **Bank:** Opay  
- **Account Number:** 7026605935  
- **Account Name:** Ajisebola Oluwapelumi
