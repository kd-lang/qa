import { CanonicalAst, CanonicalNode } from '../canonical/canonical-ast';
import { ScopedSymbolTable } from '../symbols/symbol-table';
import { NamespaceTable } from '../symbols/namespace-table';

/**
 * Represents a single file in the project, now with a scoped symbol table.
 */
export interface ProjectFile {
  filePath: string;
  ast: CanonicalAst;
  symbolTable: ScopedSymbolTable;
}

/**
 * A comprehensive, queryable representation of the entire project.
 * It now includes a central namespace table.
 */
export interface ProjectGraph {
  files: Map<string, ProjectFile>;
  namespaces: NamespaceTable;
  // Future: Add a global symbol map for cross-file resolution.
}

/**
 * Enhance the CanonicalNode to support queries directly.
 */
declare module '../canonical/canonical-ast' {
  interface CanonicalNode {
    /** The node ID where this symbol is defined. */
    definedIn?: string;

    /** A list of node IDs that this node references. */
    references?: string[];

    /** A list of node IDs that reference this node. */
    referencedBy?: string[];

    /** A list of file paths that this node depends on. */
    dependsOn?: string[];
  }
}
