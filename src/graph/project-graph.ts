import { CanonicalAst } from '../canonical/canonical-ast';
import { SymbolTable } from '../symbols/symbol-table';

/**
 * Represents a single file in the project.
 */
export interface ProjectFile {
  filePath: string;
  ast: CanonicalAst;
  symbolTable: SymbolTable;
}

/**
 * A comprehensive, queryable representation of the entire project.
 */
export interface ProjectGraph {
  files: Map<string, ProjectFile>;
}
