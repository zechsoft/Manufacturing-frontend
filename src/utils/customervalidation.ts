export const validatePhone = (phone: string): boolean => {
  return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone);
};

export const validateGST = (gst: string): boolean => {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
};

export const validatePAN = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

export const validateTAN = (tan: string): boolean => {
  return /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/.test(tan);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const getValidationErrors = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.companyName?.trim()) {
    errors.companyName = 'Company name is required';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Invalid phone format';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.address?.trim()) {
    errors.address = 'Address is required';
  } else if (data.address.length < 10) {
    errors.address = 'Address must be at least 10 characters';
  }

  if (!data.GST?.trim()) {
    errors.GST = 'GST number is required';
  } else if (!validateGST(data.GST)) {
    errors.GST = 'Invalid GST format (e.g., 22AAAAA0000A1Z5)';
  }

  if (!data.PAN?.trim()) {
    errors.PAN = 'PAN number is required';
  } else if (!validatePAN(data.PAN)) {
    errors.PAN = 'Invalid PAN format (e.g., ABCDE1234F)';
  }

  if (!data.TAN?.trim()) {
    errors.TAN = 'TAN number is required';
  } else if (!validateTAN(data.TAN)) {
    errors.TAN = 'Invalid TAN format (e.g., ABCD12345E)';
  }

  if (!data.commercialEmail?.trim()) {
    errors.commercialEmail = 'Commercial email is required';
  } else if (!validateEmail(data.commercialEmail)) {
    errors.commercialEmail = 'Invalid commercial email format';
  }

  if (data.creditDays && (isNaN(data.creditDays) || data.creditDays < 0 || data.creditDays > 90)) {
    errors.creditDays = 'Credit days must be between 0-90';
  }

  return errors;
};