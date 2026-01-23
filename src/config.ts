export const REDEEM_THRESHOLD = 100;

export interface RedeemSuccessCopy {
  title: string;
  mainMessage: string;
  subMessage: string;
  buttonText: string;
  footerText: string;
}

export interface CopyConfig {
  redeemSuccess: RedeemSuccessCopy;
}

export const DEFAULT_COPY: CopyConfig = {
  redeemSuccess: {
    title: 'GIFT UNLOCKED!',
    mainMessage: 'Your gift is ready!',
    subMessage: "Now let's make a birthday mix CD!",
    buttonText: 'Continue to CD Mix! 💿',
    footerText: 'Happy Birthday!',
  },
};

export function getCopy(
  customCopy?: Partial<CopyConfig>,
  interpolationVars?: Record<string, string>
): CopyConfig {
  const merged = { ...DEFAULT_COPY, ...customCopy };

  if (!interpolationVars) {
    return merged;
  }

  return {
    redeemSuccess: {
      title: interpolateString(merged.redeemSuccess.title, interpolationVars),
      mainMessage: interpolateString(merged.redeemSuccess.mainMessage, interpolationVars),
      subMessage: interpolateString(merged.redeemSuccess.subMessage, interpolationVars),
      buttonText: interpolateString(merged.redeemSuccess.buttonText, interpolationVars),
      footerText: interpolateString(merged.redeemSuccess.footerText, interpolationVars),
    },
  };
}

function interpolateString(text: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }, text);
}
