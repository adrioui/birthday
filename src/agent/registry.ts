export type AgentActionResult =
  | { ok: true; data?: unknown }
  | { ok: false; errorCode: string; message?: string };

export type ActionHandler = (payload?: unknown) => Promise<AgentActionResult>;

export type AgentRegistry = {
  actions: {
    run: (actionType: string, payload?: unknown) => Promise<AgentActionResult>;
    list: () => string[];
  };
  getState: () => {
    route: string;
    charms: { id: string; name: string; points: number }[];
    totalPoints: number;
    isRedeemed: boolean;
  };
};

let stateGetter: AgentRegistry['getState'] | null = null;

export function registerStateGetter(getter: AgentRegistry['getState']) {
  stateGetter = getter;
}

type State = ReturnType<AgentRegistry['getState']>;

function getCurrentState(): State {
  if (!stateGetter) {
    return {
      route: '',
      charms: [],
      totalPoints: 0,
      isRedeemed: false,
    };
  }

  return stateGetter();
}

const handlers = new Map<string, ActionHandler>();

export const registry: AgentRegistry['actions'] = {
  async run(actionType: string, payload?: unknown): Promise<AgentActionResult> {
    const handler = handlers.get(actionType);
    if (!handler) {
      return { ok: false, errorCode: 'ACTION_NOT_FOUND', message: `Unknown action: ${actionType}` };
    }
    return handler(payload);
  },
  list() {
    return [...handlers.keys()];
  },
};

export function registerAction(name: string, handler: ActionHandler) {
  handlers.set(name, handler);
}

export function exposeAgentBridge() {
  if (typeof window === 'undefined') return;

  const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';
  const isDev = import.meta.env.DEV;

  if (isTestMode || isDev) {
    Object.assign(window, {
      __birthdayOS: {
        actions: registry,
        getState: getCurrentState,
      },
    });
  }
}
