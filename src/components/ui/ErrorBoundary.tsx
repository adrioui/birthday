import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-periwinkle p-4">
          <div className="border-4 border-deep-black bg-system-grey p-8 font-pixel text-xl shadow-hard">
            <p className="text-deep-black">SYSTEM ERROR - REFRESH TO REBOOT</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
