import { APIError } from "./errors";
import { logger } from "./logger";

/**
 * Wraps server actions to catch errors securely and prevent leaking details to client
 */
export async function withActionHandler<T>(
  action: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error: unknown) {
    logger.error("Server Action Error:", error);

    if (error instanceof APIError && error.isOperational) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "An unexpected error occurred. Please try again later." };
  }
}
