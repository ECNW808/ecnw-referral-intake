/**
 * Honeypot field name - should be hidden from users
 */
export const HONEYPOT_FIELD_NAME = 'website_url';

/**
 * Check if form submission is likely from a bot
 */
export function isBotSubmission(formData: Record<string, any>): boolean {
  // Check honeypot field
  if (formData[HONEYPOT_FIELD_NAME] && formData[HONEYPOT_FIELD_NAME].length > 0) {
    return true; // Bot filled in honeypot field
  }

  // Check for required fields
  if (!formData.patientFirstName || !formData.patientLastName) {
    return true; // Missing required fields
  }

  // Check for suspicious patterns
  if (formData.patientFirstName && formData.patientFirstName.length > 100) {
    return true; // Unusually long name
  }

  // Check for common spam patterns
  const spamPatterns = [
    /viagra|cialis|casino|lottery|prize|click here|buy now/i,
    /http:\/\/|https:\/\//i, // URLs in text fields (except email)
  ];

  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      for (const pattern of spamPatterns) {
        if (pattern.test(value)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Validate user interaction timing
 * Returns true if submission seems legitimate (not too fast)
 */
export function isValidInteractionTiming(submissionTimeMs: number): boolean {
  // If form submitted in less than 2 seconds, likely a bot
  if (submissionTimeMs < 2000) {
    return false;
  }

  // If form takes more than 1 hour, likely abandoned
  if (submissionTimeMs > 3600000) {
    return false;
  }

  return true;
}

/**
 * Generate honeypot HTML
 */
export function getHoneypotHtml(): string {
  return `
    <div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;">
      <input 
        type="text" 
        name="${HONEYPOT_FIELD_NAME}" 
        id="${HONEYPOT_FIELD_NAME}"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      />
      <label for="${HONEYPOT_FIELD_NAME}" style="display: none;">
        Leave this field empty
      </label>
    </div>
  `;
}

/**
 * Check for suspicious user agent
 */
export function isSuspiciousUserAgent(userAgent: string): boolean {
  const botPatterns = [
    /bot|crawler|spider|scraper|curl|wget|python|java(?!script)|perl|php|ruby|go-http-client/i,
    /headless|phantom|puppeteer|playwright|selenium/i,
  ];

  for (const pattern of botPatterns) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  return false;
}
