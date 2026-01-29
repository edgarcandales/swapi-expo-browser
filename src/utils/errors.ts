import { ApiError } from '../api/swapiClient';

function isApiError(err: unknown): err is ApiError {
  return Boolean(err && typeof err === 'object' && 'kind' in (err as ApiError));
}

export function describeError(error: unknown): string {
  if (isApiError(error)) {
    switch (error.kind) {
      case 'timeout':
        return 'Request timed out. Please try again.';
      case 'network':
        return 'Network error. Check your connection and retry.';
      case 'server':
        return `Server error${error.status ? ` (${error.status})` : ''}. Please retry.`;
      case 'parse':
        return 'Received malformed data from the server.';
      default:
        return error.message;
    }
  }

  if (error instanceof Error) return error.message;
  return 'Unexpected error occurred.';
}
