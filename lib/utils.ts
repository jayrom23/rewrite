// lib\utils.ts

export function sanitizeFilename(filename: string): string {
  const invalidCharsRegex = /[\\/:*?"<>|]/g; // Define regex for invalid characters
  let sanitizedFilename = filename.replace(invalidCharsRegex, '-').replace(/\s+/g, '_'); // Replace invalid chars and spaces
  
  // Remove leading/trailing dots and underscores which might be invalid as well
  sanitizedFilename = sanitizedFilename.replace(/^\.+/, '').replace(/^_+/, '').replace(/\.+$/, '').replace(/_+$/, '');

  // Truncate filename to a maximum length of 50 characters
  sanitizedFilename = sanitizedFilename.slice(0, 50);

  // Ensure filename is not empty after sanitization, default to "file"
  if (!sanitizedFilename) {
    sanitizedFilename = 'file';
  }

  return sanitizedFilename;
}
