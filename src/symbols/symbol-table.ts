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
 * A table of all symbols in a given scope (e.g., a file).
 * The key is the symbol name.
 */
export interface SymbolTable {
  symbols: Map<string, Symbol>;
}
