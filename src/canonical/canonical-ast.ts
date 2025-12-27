
/**
 * A language-agnostic, queryable knowledge graph for Java, Python, and TypeScript that:
 * - Does not report false errors for package/module paths
 * - Correctly distinguishes namespaces vs symbols
 * - Supports dependency analysis, error localization, refactoring, and impact analysis
 * - Works without requiring the entire project context
 */

/**
 * The set of supported languages.
 */
export enum Language {
  JAVA = 'java',
  PYTHON = 'python',
  TYPESCRIPT = 'typescript',
  UNKNOWN = 'unknown',
}

/**
 * The semantic role of a node in the AST, independent of its language-specific type.
 * This is the cornerstone of the language-agnostic analysis.
 */
export enum NodeRole {
  // Non-resolvable roles
  NAMESPACE_SEGMENT = 'NAMESPACE_SEGMENT', // e.g., 'com', 'nival', 'chit'
  MODULE_PATH = 'MODULE_PATH', // e.g., 'com.nival.chit.dto'
  TYPE_DECLARATION = 'TYPE_DECLARATION', // e.g., 'class Auction', 'interface User'
  FUNCTION_DECLARATION = 'FUNCTION_DECLARATION', // e.g., 'void save()', 'def calculate()'
  VARIABLE_DECLARATION = 'VARIABLE_DECLARATION', // e.g., 'int x =', 'let y ='

  // Resolvable roles
  TYPE_REFERENCE = 'TYPE_REFERENCE', // e.g., new AuctionDTO(), List<String>
  FUNCTION_CALL = 'FUNCTION_CALL', // e.g., 'save()', 'print()'
  VARIABLE_REFERENCE = 'VARIABLE_REFERENCE', // e.g., 'x', 'this.user'
  FIELD_REFERENCE = 'FIELD_REFERENCE', // e.g., 'obj.field'
  IMPORT_TARGET = 'IMPORT_TARGET', // The leaf of an import statement, e.g., 'AuctionDTO' in 'import ...AuctionDTO'

  // Other roles
  UNKNOWN = 'UNKNOWN',
}

/**
 * Represents a point in a source file.
 */
export interface Point {
  row: number;
  column: number;
}

/**
 * A single node in the Canonical AST.
 * It includes language-agnostic type and role information.
 */
export interface CanonicalNode {
  id: string; // A unique identifier for the node
  language: Language;
  type: string; // The original language-specific type from the parser
  role: NodeRole; // The new, standardized semantic role
  text: string; // The source text of the node
  filePath: string;
  startPosition: Point;
  endPosition: Point;
  children: string[];
}

/**
 * A language-agnostic Abstract Syntax Tree for a single file.
 */
export interface CanonicalAst {
  filePath: string;
  rootId: string;
  nodes: Map<string, CanonicalNode>;
}
