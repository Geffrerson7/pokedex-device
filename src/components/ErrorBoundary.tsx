import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Error capturado por ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error" role="alert">
          <h1>Algo salió mal</h1>
          <p>Ocurrió un error inesperado al mostrar la aplicación.</p>
          <button type="button" className="key" onClick={() => window.location.reload()}>
            Recargar aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
