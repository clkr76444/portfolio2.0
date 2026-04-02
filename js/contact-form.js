const SUPABASE_URL = 'https://ghtlwokodfxktcumzoyu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodGx3b2tvZGZ4a3RjdW16b3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMzAyNDcsImV4cCI6MjA5MDcwNjI0N30.vsA43DgHQPR8iWP431C_k6vcDDU-080qBi8OpkdufxE';

const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('[type="submit"]');
const submitLabel = submitBtn.querySelector('span');
const statusEl = document.getElementById('form-status');
const statusMessageEl = statusEl.querySelector('.form-status__message');
const statusCloseBtn = statusEl.querySelector('.form-status__close');
const statusOverlay = document.getElementById('form-status-overlay');
let statusTimeout;

statusCloseBtn.addEventListener('click', clearStatus);
statusOverlay.addEventListener('click', clearStatus);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') clearStatus(); });

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const navn = form.navn.value.trim();
    const telefon = form.telefon.value.trim();
    const email = form.email.value.trim();
    const besked = form.besked.value.trim();

    // Basic validation
    if (!navn || !email || !besked) {
        setStatus('error', 'Fejl: Udfyld venligst navn, email og besked.');
        return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.setAttribute('data-loading', '');
    submitLabel.textContent = 'Sender…';
    setStatus('', '');

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ navn, telefon, email, besked })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        setStatus('success', 'Tak for din besked! Jeg vender tilbage hurtigst muligt.');
        form.reset();
    } catch {
        setStatus('error', 'Fejl: Beskeden kunne ikke sendes. Prøv igen eller skriv direkte til mig på mail.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.removeAttribute('data-loading');
        submitLabel.textContent = 'Send besked';
    }
});

function setStatus(type, message) {
    window.clearTimeout(statusTimeout);
    statusMessageEl.textContent = message;
    statusEl.className = 'form-status' + (type ? ` form-status--${type}` : '');

    if (message) {
        statusEl.classList.add('is-visible');
        statusTimeout = window.setTimeout(clearStatus, 5000);
    }
}

function clearStatus() {
    window.clearTimeout(statusTimeout);
    statusMessageEl.textContent = '';
    statusEl.className = 'form-status';
}
