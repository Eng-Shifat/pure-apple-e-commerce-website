export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string) {
  return /^01[3-9]\d{8}$/.test(phone.replace(/\s/g, ""));
}

export function validateCheckout(data: Record<string, string>) {
  const errors: Record<string, string> = {};
  if (!data.name?.trim())        errors.name    = "Name is required";
  if (!validatePhone(data.phone)) errors.phone  = "Enter a valid BD phone number";
  if (!data.address?.trim())     errors.address = "Address is required";
  if (!data.city?.trim())        errors.city    = "City is required";
  return errors;
}
