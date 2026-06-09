export const validateUsername = (val) => {
  if (!val || !val.trim()) return 'Username is required';
  if (val.trim().length < 3) return 'Username must be at least 3 characters';
  if (val.trim().length > 30) return 'Username must be under 30 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(val.trim()))
    return 'Username can only contain letters, numbers, and underscores';
  return null;
};

export const validateEmail = (val) => {
  if (!val || !val.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()))
    return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (val) => {
  if (!val) return 'Password is required';
  if (val.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateOTP = (val) => {
  if (!val || !val.trim()) return 'OTP is required';
  if (!/^\d{6}$/.test(val.trim())) return 'OTP must be exactly 6 digits';
  return null;
};

export const validateRequired = (val, fieldName = 'This field') => {
  if (!val || !val.toString().trim()) return `${fieldName} is required`;
  return null;
};

export const validateURL = (val) => {
  if (!val || !val.trim()) return null; // optional
  try {
    new URL(val.trim());
    return null;
  } catch {
    return 'Please enter a valid URL (e.g. https://example.com)';
  }
};

export const validatePhone = (val) => {
  if (!val || !val.trim()) return null; // optional
  if (!/^\+?[\d\s\-()]{7,15}$/.test(val.trim()))
    return 'Please enter a valid phone number';
  return null;
};

// ─── Batch validator ─────────────────────────────────────────────────
// Pass an array of [validator_fn, value] pairs
// Returns first error found, or null
export const validateAll = (pairs) => {
  for (const [fn, val, ...args] of pairs) {
    const err = fn(val, ...args);
    if (err) return err;
  }
  return null;
};
