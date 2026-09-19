/**
 * Utility functions for WhatsApp messaging across GMC Marketplace
 * Direct WhatsApp chat integration for Bhutanese merchants and buyers
 */

export function cleanBhutanPhoneNumber(phone: string): string {
  if (!phone) return '97517123456';
  
  // Extract all digits
  let digits = phone.replace(/\D/g, '');

  // If empty, return fallback verified merchant line
  if (!digits) return '97517123456';

  // Handle common Bhutan mobile formats:
  // e.g. 017123456 (9 digits starting with 0)
  if (digits.length === 9 && digits.startsWith('0')) {
    digits = '975' + digits.substring(1);
  }
  // e.g. 17123456 or 77123456 (8-digit standard Bhutan mobile)
  else if (digits.length === 8) {
    digits = '975' + digits;
  }
  // e.g. already has 975 prefix (e.g. 97517123456)
  else if (digits.startsWith('975')) {
    // Already international format
  }
  // If starts with 00975, remove 00
  else if (digits.startsWith('00975')) {
    digits = digits.substring(2);
  }
  
  return digits;
}

export function formatWhatsAppUrl(phone: string, text?: string): string {
  const cleanDigits = cleanBhutanPhoneNumber(phone);
  const encodedText = text ? encodeURIComponent(text) : '';
  return `https://wa.me/${cleanDigits}${encodedText ? `?text=${encodedText}` : ''}`;
}

export function getDisplayPhone(phone: string): string {
  if (!phone) return '+975-17123456';
  return phone;
}
