/**
 * The type of a symbol (e.g., class, function, variable).
 */
export enum SymbolType {
  CLASS = 'class',
  FUNCTION = 'function',
  VARIABLE = 'variable',
  UNKNOWN = 'unknown',
}

/**
 * Represents a single symbol in the codebase.
 */
export interface Symbol {
  name: string;
  type: SymbolType;
  filePath: string;
  nodeId: string; // The ID of the declaration node in the CanonicalAst
}

/**
 * A table of all symbols in a given file, organized by scope.
 */
export interface ScopedSymbolTable {
  /** Symbols defined directly within this file. */
  fileSymbols: Map<string, Symbol>;

  /** Symbols brought into this file's scope via import statements. */
  importedSymbols: Map<string, Symbol>;

  /** Symbols made available to other files via export statements. */
  exportedSymbols: Map<string, Symbol>;
}
