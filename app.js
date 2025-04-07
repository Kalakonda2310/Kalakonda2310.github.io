// Simulated outsourced encrypted fingerprint storage (in-memory)
let outsourcedDB = {}; // authID -> hashedFingerprint
let fingerprintStore = {}; // authID -> rawFingerprint (simulated for matching)

// Generate a random auth ID
function generateAuthID() {
  return 'auth-' + Math.random().toString(36).substr(2, 10);
}

// Simulated hashing function
async function hashFingerprint(fingerprint) {
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simulate fingerprint capture (random for demo)
function captureFingerprint() {
  return Math.random().toString(36).substring(2, 15); // Fake fingerprint data
}

// Enroll user
async function enroll() {
  const fingerprint = captureFingerprint();
  const hashedFingerprint = await hashFingerprint(fingerprint);
  const authID = generateAuthID();

  outsourcedDB[authID] = hashedFingerprint;
  fingerprintStore[authID] = fingerprint; // store original for matching

  showStatus(`✅ Fingerprint enrolled.\n🔐 Your Auth ID is: ${authID}`);
  console.log("Outsourced DB:", outsourcedDB);
}

// Authenticate using auth ID
async function authenticate() {
  const authID = document.getElementById("authID").value.trim();
  if (!authID) {
    showStatus("❗ Please enter your Auth ID.");
    return;
  }

  const storedHash = outsourcedDB[authID];
  const originalFingerprint = fingerprintStore[authID];

  if (!storedHash || !originalFingerprint) {
    showStatus("❌ Auth ID not found.");
    return;
  }

  // Use the same fingerprint captured during enrollment (simulated match)
  const currentFingerprint = originalFingerprint; // match on purpose
  const hashedCurrent = await hashFingerprint(currentFingerprint);

  if (hashedCurrent === storedHash) {
    showStatus("✅ Authentication successful.");
  } else {
    showStatus("❌ Authentication failed.");
  }
}

// Display status message
function showStatus(message) {
  document.getElementById("status").innerText = message;
}
