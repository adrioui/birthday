export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

interface CharmLike {
  id?: unknown;
  name?: unknown;
  icon?: unknown;
  power?: unknown;
  points?: unknown;
  iconBgColor?: unknown;
  iconColor?: unknown;
}

function isValidColor(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const color = value.trim();

  if (color === '') return true;

  const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}$/;
  const namedColorPattern =
    /^(transparent|black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|rebeccapurple)$/;
  const rgbPattern =
    /^rgba?\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*(?:,\s*(0?\.\d+|1|0)\s*)?\)$/;
  const hslPattern =
    /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*(?:,\s*(0?\.\d+|1|0)\s*)?\)$/;

  if (hexPattern.test(color)) return true;
  if (namedColorPattern.test(color)) return true;
  if (rgbPattern.test(color)) return true;
  if (hslPattern.test(color)) return true;

  return false;
}

export function validateCharm(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const charm = data as CharmLike;
  return (
    typeof charm.id === 'string' &&
    typeof charm.name === 'string' &&
    typeof charm.icon === 'string' &&
    typeof charm.power === 'string' &&
    typeof charm.points === 'number' &&
    (charm.iconBgColor === undefined || isValidColor(charm.iconBgColor)) &&
    (charm.iconColor === undefined || isValidColor(charm.iconColor))
  );
}

export function getValidatedCharms<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;

    const parsed = JSON.parse(item);
    if (!Array.isArray(parsed)) {
      console.warn(`Invalid charm data from ${key}: expected array`);
      return fallback;
    }

    const validCharms = parsed.filter((charm, index) => {
      if (validateCharm(charm)) return true;
      console.warn(`Invalid charm at index ${index} in ${key}:`, charm);
      return false;
    });

    return validCharms.length > 0 ? (validCharms as T) : fallback;
  } catch (e) {
    console.warn(`Failed to parse charm data from ${key}:`, e);
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write failed:', e);
  }
}

export function getSessionItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setSessionItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Session storage write failed:', e);
  }
}

export function removeSessionItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.error('Session storage remove failed:', e);
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Storage remove failed:', e);
  }
}
