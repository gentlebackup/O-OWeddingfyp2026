// ===== Countdown Timer =====
const weddingDate = new Date('2026-10-17T09:00:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    document.getElementById('countdown').innerHTML = '<p style="font-size:1.2rem;letter-spacing:0.1em;">The celebration has begun!</p>';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Mobile Navigation =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ===== RSVP Form Handling =====
const form = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

/*
  ============================================
  IMPORTANT: Form Submission Setup
  ============================================
  To receive RSVPs in BOTH your email AND a Google Sheet:

  Option A (Recommended - Free forever):
  1. Create a new Google Sheet
  2. Go to Extensions → Apps Script
  3. Paste the code from the README (or the setup guide)
  4. Deploy as Web App → Anyone can access
  5. Copy the Web App URL and paste it below as SCRIPT_URL

  Option B: Use Formspree (easier for email only)
  - Create free account at formspree.io
  - Create a form and get the endpoint
  - Replace the fetch URL below
*/

const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'; 
// Example: 'https://script.google.com/macros/s/AKfycb.../exec'

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic validation
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const guests = form.guests.value;

  if (!name || !phone || !guests) {
    showMessage('Please fill in all required fields.', 'error');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;
  formMessage.hidden = true;

  const formData = {
    name: name,
    phone: phone,
    guests: guests,
    meal: form.meal.value || 'Not specified',
    message: form.message.value.trim() || '',
    donation: form.donation.value.trim() || 'None',
    timestamp: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
  };

  try {
    // Check if user has set up the script URL
    if (SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
      // Demo mode - simulate success for preview
      await new Promise(resolve => setTimeout(resolve, 1200));
      showMessage('Thank you! Your RSVP has been received. (Demo mode — please set up the form endpoint to collect real responses)', 'success');
      form.reset();
    } else {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // With no-cors we can't read the response, so we assume success
      showMessage('Thank you! Your RSVP has been successfully submitted. We look forward to celebrating with you!', 'success');
      form.reset();
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showMessage('Something went wrong. Please try again or contact the couple directly.', 'error');
  } finally {
    submitBtn.disabled = false;
    btnText.hidden = false;
    btnLoading.hidden = true;
  }
});

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = `form-message ${type}`;
  formMessage.hidden = false;
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== Cloudinary Guest Photo Upload + Live Gallery =====
const CLOUD_NAME = 'bd7ezy8q';
const UPLOAD_PRESET = 'wedding_guest';
const GUEST_TAG = 'wedding_guest';

const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('guestPhotoInput');
const uploadStatus = document.getElementById('uploadStatus');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const guestGallery = document.getElementById('guestGallery');
const btnTextEl = uploadBtn.querySelector('.btn-text');
const btnLoadingEl = uploadBtn.querySelector('.btn-loading');

// Open phone gallery when button is clicked
uploadBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', async () => {
  const files = Array.from(fileInput.files);
  if (!files.length) return;

  uploadBtn.disabled = true;
  btnTextEl.hidden = true;
  btnLoadingEl.hidden = false;
  uploadStatus.hidden = true;
  uploadProgress.hidden = false;

  let uploaded = 0;
  const total = files.length;

  for (const file of files) {
    try {
      await uploadToCloudinary(file);
      uploaded++;
      const percent = Math.round((uploaded / total) * 100);
      progressFill.style.width = percent + '%';
      progressText.textContent = percent + '%';
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }

  // Reset UI
  uploadBtn.disabled = false;
  btnTextEl.hidden = false;
  btnLoadingEl.hidden = true;
  uploadProgress.hidden = true;
  progressFill.style.width = '0%';
  fileInput.value = '';

  if (uploaded > 0) {
    showUploadStatus(`Successfully uploaded ${uploaded} file${uploaded > 1 ? 's' : ''}! Thank you ❤️`, 'success');
    // Refresh gallery after a short delay so Cloudinary can process
    setTimeout(loadGuestGallery, 1500);
  } else {
    showUploadStatus('Upload failed. Please try again.', 'error');
  }
});

function showUploadStatus(text, type) {
  uploadStatus.textContent = text;
  uploadStatus.className = `upload-status ${type}`;
  uploadStatus.hidden = false;
}

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('tags', GUEST_TAG);

  // Detect if video or image
  const isVideo = file.type.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Upload failed');
  }

  return response.json();
}

// Load live guest gallery from Cloudinary list endpoint
async function loadGuestGallery() {
  const debugEl = document.getElementById('galleryDebug');
  guestGallery.innerHTML = '<div class="gallery-loading">Loading guest photos...</div>';
  if (debugEl) {
    debugEl.hidden = true;
    debugEl.textContent = '';
  }

  try {
    const listUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${GUEST_TAG}.json`;
    console.log('Fetching gallery from:', listUrl);

    const res = await fetch(listUrl, { cache: 'no-store' });

    if (!res.ok) {
      guestGallery.innerHTML = `
        <div class="gallery-empty">
          <p>No guest photos yet.</p>
          <p class="small">Be the first to upload!</p>
        </div>`;
      if (debugEl) {
        debugEl.hidden = false;
        debugEl.textContent = `Status: ${res.status}`;
      }
      return;
    }

    const data = await res.json();
    const resources = data.resources || [];
    console.log('Found resources:', resources.length);

    if (resources.length === 0) {
      guestGallery.innerHTML = `
        <div class="gallery-empty">
          <p>No guest photos yet.</p>
          <p class="small">Be the first to upload!</p>
        </div>`;
      return;
    }

    // Sort newest first
    resources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    guestGallery.innerHTML = resources.map(r => {
      const format = r.format || 'jpg';
      const version = r.version || 1;
      const publicId = r.public_id;
      const isVideo = (r.resource_type === 'video') || ['mp4','mov','webm','avi'].includes(format);

      if (isVideo) {
        const videoUrl = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/v${version}/${publicId}.${format}`;
        return `
          <div class="guest-item">
            <video controls playsinline preload="metadata" src="${videoUrl}"></video>
          </div>`;
      }

      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v${version}/${publicId}.${format}`;
      return `
        <div class="guest-item">
          <a href="${url}" target="_blank" rel="noopener">
            <img src="${url}" alt="Guest photo" loading="lazy" onerror="this.parentElement.parentElement.style.display='none'">
          </a>
        </div>`;
    }).join('');

    if (debugEl) {
      debugEl.hidden = false;
      debugEl.textContent = `Showing ${resources.length} photo(s)`;
    }

  } catch (err) {
    console.error('Gallery load error:', err);
    guestGallery.innerHTML = `
      <div class="gallery-empty">
        <p>Could not load guest photos.</p>
        <p class="small">${err.message || 'Network error'}</p>
      </div>`;
    if (debugEl) {
      debugEl.hidden = false;
      debugEl.textContent = 'Error: ' + (err.message || 'unknown');
    }
  }
}

// Refresh button
const refreshBtn = document.getElementById('refreshGalleryBtn');
if (refreshBtn) {
  refreshBtn.addEventListener('click', loadGuestGallery);
}

// Load gallery when page is ready
document.addEventListener('DOMContentLoaded', loadGuestGallery);
if (document.readyState !== 'loading') {
  loadGuestGallery();
}
