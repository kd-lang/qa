/**
 * A standardized error code for a type of analysis error.
 */
export enum ErrorCode {
  UNRESOLVED_IDENTIFIER = 'unresolved-identifier',
  // More error codes will be added here.
}

/**
 * Represents a single error or "smell" found by the analysis engine.
 */
export interface AnalysisError {
  code: ErrorCode;
  message: string;
  filePath: string;
  nodeId: string; // The ID of the node where the error occurred.
}
