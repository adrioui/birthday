export {};

declare global {
  interface Window {
    __birthdayOS?: {
      actions: {
        run: (
          actionType: string,
          payload?: unknown
        ) => Promise<{ ok: boolean; data?: unknown; errorCode?: string; message?: string }>;
        list: () => string[];
      };
      getState: () => {
        route: string;
        charms: { id: string; name: string; points: number }[];
        totalPoints: number;
        isRedeemed: boolean;
      };
    };
  }
}
