// lib\utils.test.ts
import { sanitizeFilename } from './utils';

describe('sanitizeFilename', () => {
  it('should remove invalid characters and replace spaces with underscores', () => {
    expect(sanitizeFilename('File:Name/With\\Invalid*Chars?')).toBe('FileName-With-Invalid-Chars-');
    expect(sanitizeFilename('  filename with spaces  ')).toBe('filename_with_spaces');
  });

  it('should truncate filename to 50 characters', () => {
    const longFilename = 'a'.repeat(100) + '.txt';
    expect(sanitizeFilename(longFilename)).toBe('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  });

  it('should handle empty filename and return "file"', () => {
    expect(sanitizeFilename('')).toBe('file');
    expect(sanitizeFilename('   ')).toBe('file');
  });

  it('should remove leading and trailing dots and underscores', () => {
    expect(sanitizeFilename('...leadingDots')).toBe('leadingDots');
    expect(sanitizeFilename('___leadingUnderscores')).toBe('leadingUnderscores');
    expect(sanitizeFilename('trailingDots...')).toBe('trailingDots');
    expect(sanitizeFilename('trailingUnderscores___')).toBe('trailingUnderscores');
    expect(sanitizeFilename('._.bothEnds._.')).toBe('bothEnds');
  });

  it('should handle valid filenames without changes', () => {
    expect(sanitizeFilename('valid-filename')).toBe('valid-filename');
    expect(sanitizeFilename('filename.with.dots')).toBe('filename.with.dots');
    expect(sanitizeFilename('filename_with_underscores')).toBe('filename_with_underscores');
  });
});
