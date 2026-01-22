import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getItem, setItem, removeItem, validateCharm, getValidatedCharms } from './storage';
import { testCharm, testCharm2, testCharmWithColors } from '../test/fixtures';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getItem', () => {
    it('returns fallback when localStorage is empty', () => {
      expect(getItem('test-key', 'default')).toBe('default');
    });

    it('returns parsed value when valid JSON exists', () => {
      localStorage.setItem('test-key', JSON.stringify({ value: 42 }));
      expect(getItem('test-key', null)).toEqual({ value: 42 });
    });

    it('returns fallback when JSON is invalid', () => {
      localStorage.setItem('test-key', 'invalid-json');
      expect(getItem('test-key', 'default')).toBe('default');
    });
  });

  describe('setItem', () => {
    it('stores value as JSON string', () => {
      setItem('test-key', { value: 42 });
      const stored = localStorage.getItem('test-key');
      expect(stored).toBe(JSON.stringify({ value: 42 }));
    });

    it('handles localStorage quota errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });

      expect(() => setItem('test-key', 'test')).not.toThrow();
    });
  });

  describe('removeItem', () => {
    it('removes item from localStorage', () => {
      localStorage.setItem('test-key', 'value');
      removeItem('test-key');
      expect(localStorage.getItem('test-key')).toBeNull();
    });

    it('handles missing items gracefully', () => {
      expect(() => removeItem('nonexistent-key')).not.toThrow();
    });

    it('handles localStorage errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => removeItem('test-key')).not.toThrow();
    });
  });

  describe('validateCharm', () => {
    it('returns true for valid charm', () => {
      expect(validateCharm(testCharm)).toBe(true);
    });

    it('returns true for valid charm with optional colors', () => {
      expect(validateCharm(testCharmWithColors)).toBe(true);
    });

    it('returns false for null', () => {
      expect(validateCharm(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(validateCharm(undefined)).toBe(false);
    });

    it('returns false for non-object', () => {
      expect(validateCharm('not an object')).toBe(false);
    });

    it('returns false when missing required field: id', () => {
      const invalidCharm = { ...testCharm, id: undefined };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns false when missing required field: name', () => {
      const invalidCharm = { ...testCharm, name: undefined };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns false when missing required field: icon', () => {
      const invalidCharm = { ...testCharm, icon: undefined };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns false when missing required field: power', () => {
      const invalidCharm = { ...testCharm, power: undefined };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns false when missing required field: points', () => {
      const invalidCharm = { ...testCharm, points: undefined };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns false when points is not a number', () => {
      const invalidCharm = { ...testCharm, points: 'not a number' as unknown as number };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns false when id is not a string', () => {
      const invalidCharm = { ...testCharm, id: 123 as unknown as string };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns false when iconBgColor is not a string or undefined', () => {
      const invalidCharm = { ...testCharm, iconBgColor: 123 as unknown as string };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns false when iconColor is not a string or undefined', () => {
      const invalidCharm = { ...testCharm, iconColor: {} as unknown as string };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns false when iconBgColor is not a valid color', () => {
      const invalidCharm = { ...testCharm, iconBgColor: 'javascript:alert(1)' };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns false when iconColor is not a valid color', () => {
      const invalidCharm = { ...testCharm, iconColor: 'invalid-color-name-xyz' };
      expect(validateCharm(invalidCharm)).toBe(false);
    });

    it('returns true for valid hex colors', () => {
      const validCharm = { ...testCharm, iconBgColor: '#FFF', iconColor: '#123ABC' };
      expect(validateCharm(validCharm)).toBe(true);
    });

    it('returns true for valid named colors', () => {
      const validCharm = { ...testCharm, iconBgColor: 'red', iconColor: 'blue' };
      expect(validateCharm(validCharm)).toBe(true);
    });

    it('returns true for valid rgb colors', () => {
      const validCharm = {
        ...testCharm,
        iconBgColor: 'rgb(255, 0, 0)',
        iconColor: 'rgb(0, 255, 0)',
      };
      expect(validateCharm(validCharm)).toBe(true);
    });

    it('returns true for valid rgba colors', () => {
      const validCharm = {
        ...testCharm,
        iconBgColor: 'rgba(255, 0, 0, 0.5)',
        iconColor: 'rgba(0, 255, 0, 1)',
      };
      expect(validateCharm(validCharm)).toBe(true);
    });

    it('returns true for valid hsl colors', () => {
      const validCharm = {
        ...testCharm,
        iconBgColor: 'hsl(0, 100%, 50%)',
        iconColor: 'hsl(120, 100%, 50%)',
      };
      expect(validateCharm(validCharm)).toBe(true);
    });

    it('returns true for valid hsla colors', () => {
      const validCharm = {
        ...testCharm,
        iconBgColor: 'hsla(0, 100%, 50%, 0.5)',
        iconColor: 'hsla(120, 100%, 50%, 1)',
      };
      expect(validateCharm(validCharm)).toBe(true);
    });

    it('returns true for empty color strings', () => {
      const validCharm = { ...testCharm, iconBgColor: '', iconColor: ' ' };
      expect(validateCharm(validCharm)).toBe(true);
    });

    it('returns false for color with expression', () => {
      const invalidCharm = { ...testCharm, iconBgColor: 'expression(alert(1))' };
      expect(validateCharm(invalidCharm)).toBe(false);
    });
  });

  describe('getValidatedCharms', () => {
    it('returns fallback when localStorage is empty', () => {
      const result = getValidatedCharms('test-key', []);
      expect(result).toEqual([]);
    });

    it('returns valid charms from localStorage', () => {
      localStorage.setItem('test-key', JSON.stringify([testCharm, testCharm2]));
      const result = getValidatedCharms('test-key', []);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(testCharm);
      expect(result[1]).toEqual(testCharm2);
    });

    it('filters out invalid charms', () => {
      const invalidCharm = { ...testCharm, id: 123 };
      localStorage.setItem('test-key', JSON.stringify([testCharm, invalidCharm, testCharm2]));
      const result = getValidatedCharms('test-key', []);
      expect(result).toHaveLength(2);
      expect(result).toEqual([testCharm, testCharm2]);
    });

    it('returns fallback when stored value is not an array', () => {
      localStorage.setItem('test-key', JSON.stringify({ not: 'an array' }));
      const result = getValidatedCharms('test-key', []);
      expect(result).toEqual([]);
    });

    it('returns fallback when JSON is invalid', () => {
      localStorage.setItem('test-key', 'invalid-json');
      const result = getValidatedCharms('test-key', []);
      expect(result).toEqual([]);
    });

    it('returns fallback when all charms are invalid', () => {
      const invalidCharm1 = { ...testCharm, id: null };
      const invalidCharm2 = { ...testCharm, name: undefined };
      localStorage.setItem('test-key', JSON.stringify([invalidCharm1, invalidCharm2]));
      const result = getValidatedCharms('test-key', []);
      expect(result).toEqual([]);
    });

    it('warns for each invalid charm', () => {
      const invalidCharm = { ...testCharm, id: 123 };
      localStorage.setItem('test-key', JSON.stringify([testCharm, invalidCharm]));
      getValidatedCharms('test-key', []);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Invalid charm at index 1'),
        invalidCharm
      );
    });

    it('warns when data is not an array', () => {
      localStorage.setItem('test-key', JSON.stringify({ not: 'array' }));
      getValidatedCharms('test-key', []);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Invalid charm data from test-key: expected array')
      );
    });

    it('warns when JSON parsing fails', () => {
      localStorage.setItem('test-key', 'invalid-json');
      getValidatedCharms('test-key', []);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Failed to parse charm data from test-key'),
        expect.any(Error)
      );
    });

    describe('style value sanitization', () => {
      it('rejects charm with javascript: XSS in iconBgColor', () => {
        const maliciousCharm = { ...testCharm, iconBgColor: 'javascript:alert(1)' };
        localStorage.setItem('test-key', JSON.stringify([testCharm, maliciousCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toHaveLength(1);
        expect(result).toEqual([testCharm]);
      });

      it('rejects charm with javascript: XSS in iconColor', () => {
        const maliciousCharm = { ...testCharm, iconColor: 'javascript:alert(1)' };
        localStorage.setItem('test-key', JSON.stringify([maliciousCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toEqual([]);
      });

      it('rejects charm with expression() in iconBgColor', () => {
        const maliciousCharm = { ...testCharm, iconBgColor: 'expression(alert(1))' };
        localStorage.setItem('test-key', JSON.stringify([testCharm, maliciousCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toHaveLength(1);
        expect(result).toEqual([testCharm]);
      });

      it('rejects charm with expression() in iconColor', () => {
        const maliciousCharm = { ...testCharm, iconColor: 'expression(document.cookie)' };
        localStorage.setItem('test-key', JSON.stringify([maliciousCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toEqual([]);
      });

      it('accepts valid hex colors', () => {
        const validCharm = { ...testCharm, iconBgColor: '#FF0099', iconColor: '#CCFF00' };
        localStorage.setItem('test-key', JSON.stringify([validCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toEqual([validCharm]);
      });

      it('accepts valid named colors', () => {
        const validCharm = { ...testCharm, iconBgColor: 'hotpink', iconColor: 'lime' };
        localStorage.setItem('test-key', JSON.stringify([validCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toEqual([validCharm]);
      });

      it('accepts valid rgb colors', () => {
        const validCharm = {
          ...testCharm,
          iconBgColor: 'rgb(255, 0, 153)',
          iconColor: 'rgb(204, 255, 0)',
        };
        localStorage.setItem('test-key', JSON.stringify([validCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toEqual([validCharm]);
      });

      it('accepts valid rgba colors', () => {
        const validCharm = {
          ...testCharm,
          iconBgColor: 'rgba(255, 0, 153, 0.8)',
          iconColor: 'rgba(204, 255, 0, 1)',
        };
        localStorage.setItem('test-key', JSON.stringify([validCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toEqual([validCharm]);
      });

      it('accepts valid hsl colors', () => {
        const validCharm = {
          ...testCharm,
          iconBgColor: 'hsl(330, 100%, 50%)',
          iconColor: 'hsl(84, 100%, 50%)',
        };
        localStorage.setItem('test-key', JSON.stringify([validCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toEqual([validCharm]);
      });

      it('accepts valid hsla colors', () => {
        const validCharm = {
          ...testCharm,
          iconBgColor: 'hsla(330, 100%, 50%, 0.9)',
          iconColor: 'hsla(84, 100%, 50%, 1)',
        };
        localStorage.setItem('test-key', JSON.stringify([validCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toEqual([validCharm]);
      });

      it('accepts empty color strings', () => {
        const validCharm = { ...testCharm, iconBgColor: '', iconColor: ' ' };
        localStorage.setItem('test-key', JSON.stringify([validCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toEqual([validCharm]);
      });

      it('rejects invalid color format', () => {
        const invalidCharm = { ...testCharm, iconBgColor: 'not-a-valid-color-at-all' };
        localStorage.setItem('test-key', JSON.stringify([testCharm, invalidCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toHaveLength(1);
        expect(result).toEqual([testCharm]);
      });

      it('rejects malformed hex color', () => {
        const invalidCharm = { ...testCharm, iconColor: '#GGG' };
        localStorage.setItem('test-key', JSON.stringify([invalidCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toEqual([]);
      });

      it('rejects non-string color values', () => {
        const invalidCharm = { ...testCharm, iconBgColor: 123 as unknown as string };
        localStorage.setItem('test-key', JSON.stringify([testCharm, invalidCharm]));
        const result = getValidatedCharms('test-key', []);
        expect(result).toHaveLength(1);
        expect(result).toEqual([testCharm]);
      });

      it('warns for each charm with invalid color value', () => {
        const invalidCharm1 = { ...testCharm, iconBgColor: 'javascript:alert(1)' };
        const invalidCharm2 = { ...testCharm2, iconColor: 'expression(xss)' };
        localStorage.setItem('test-key', JSON.stringify([invalidCharm1, invalidCharm2]));
        getValidatedCharms('test-key', []);
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Invalid charm at index 0'),
          invalidCharm1
        );
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Invalid charm at index 1'),
          invalidCharm2
        );
      });
    });
  });
});
