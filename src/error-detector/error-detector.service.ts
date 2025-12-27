import { ProjectFile } from '../graph/project-graph';
import { AnalysisError, ErrorCode } from './analysis-error';
import { CanonicalNode, NodeRole } from '../canonical/canonical-ast';
import { ScopedSymbolTable } from '../symbols/symbol-table';

/**
 * A service that runs a set of rules against the ProjectGraph to find errors.
 * This service performs the "Resolution" phase of the analysis.
 */
export class RuleBasedErrorDetector {
  /**
   * Analyzes the entire project graph for errors based on the new, robust rules.
   * @param projectGraph The project graph to analyze.
   * @returns A list of all errors found.
   */
  public detectErrors(projectFiles: IterableIterator<ProjectFile>): AnalysisError[] {
    let allErrors: AnalysisError[] = [];

    for (const file of projectFiles) {
      const fileErrors = this.resolveIdentifiersInFile(file);
      allErrors = allErrors.concat(fileErrors);
    }

    return allErrors;
  }

  /**
   * The core of the resolution phase for a single file.
   * It traverses the AST and attempts to resolve all nodes with resolvable roles.
   * @param file The project file to analyze.
   * @returns A list of errors found in the file.
   */
  private resolveIdentifiersInFile(file: ProjectFile): AnalysisError[] {
    const errors: AnalysisError[] = [];
    const rootNode = file.ast.nodes.get(file.ast.rootId);

    if (rootNode) {
      this.traverseForResolution(rootNode, file.ast.nodes, file.symbolTable, errors);
    }

    return errors;
  }

  /**
   * Traverses the AST, identifying nodes that need to be resolved and checking them against the symbol tables.
   * @param node The current node to inspect.
   * @param allNodes A map of all nodes in the AST.
   * @param symbolTable The scoped symbol table for the file.
   * @param errors The list of errors being built.
   */
  private traverseForResolution(
    node: CanonicalNode,
    allNodes: Map<string, CanonicalNode>,
    symbolTable: ScopedSymbolTable,
    errors: AnalysisError[],
  ): void {
    // This is the crucial logic: only act on roles that are meant to be resolved.
    if (this.isResolvableRole(node.role)) {
      const symbolName = node.text;

      // Perform the scoped lookup
      const isDefinedInFile = symbolTable.fileSymbols.has(symbolName);
      const isImported = symbolTable.importedSymbols.has(symbolName);
      // TODO: Add checks for built-ins and other project files

      if (!isDefinedInFile && !isImported) {
        // This is now a TRUE error, not a false positive on a namespace.
        errors.push({
          code: ErrorCode.UNRESOLVED_IDENTIFIER,
          message: `Unresolved identifier: ${symbolName}`,
          filePath: node.filePath,
          nodeId: node.id,
        });
      }
    }

    // Continue traversal regardless of the current node's role.
    for (const childId of node.children) {
      const childNode = allNodes.get(childId);
      if (childNode) {
        this.traverseForResolution(childNode, allNodes, symbolTable, errors);
      }
    }
  }

  /**
   * A helper to determine if a node's role requires resolution.
   * @param role The NodeRole to check.
   * @returns True if the role is resolvable, false otherwise.
   */
  private isResolvableRole(role: NodeRole): boolean {
    return [
      NodeRole.TYPE_REFERENCE,
      NodeRole.FUNCTION_CALL,
      NodeRole.VARIABLE_REFERENCE,
      NodeRole.FIELD_REFERENCE,
      NodeRole.IMPORT_TARGET, // Resolving import targets can verify they exist elsewhere
    ].includes(role);
  }
}
