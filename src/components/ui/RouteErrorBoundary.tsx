import { Component, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('Route Error Boundary caught an error:', error)
    console.error('Component stack:', errorInfo.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-dvh items-center justify-center bg-periwinkle p-4">
          <div className="border-4 border-deep-black bg-system-grey p-8 font-pixel text-xl shadow-[4px_4px_0_#131315] max-w-md">
            <div className="mb-4 text-deep-black">
              <h2 className="mb-2 text-2xl font-bold text-hot-pink">SYSTEM ERROR</h2>
              <p className="text-sm">Something went wrong on this page</p>
            </div>
            
            {this.state.error && (
              <div className="mb-4 bg-periwinkle p-3 border-2 border-deep-black">
                <p className="text-xs text-deep-black break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="border-4 border-deep-black bg-lime px-6 py-2 font-pixel text-base text-deep-black hover:bg-hot-pink hover:text-white transition-colors shadow-[2px_2px_0_#131315] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                TRY AGAIN
              </button>
              
              <Link
                to="/"
                className="border-4 border-deep-black bg-white px-6 py-2 font-pixel text-base text-center text-deep-black hover:bg-hyperlink-blue hover:text-white transition-colors shadow-[2px_2px_0_#131315] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                RETURN TO HOME
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
