import { ProjectGraph } from '../graph/project-graph';
import { AnalysisError, ErrorCode } from './analysis-error';
import { CanonicalNode, CanonicalNodeType } from '../canonical/canonical-ast';
import { SymbolTable } from '../symbols/symbol-table';

/**
 * A service that runs a set of rules against the ProjectGraph to find errors.
 */
export class RuleBasedErrorDetector {
  /**
   * Analyzes the entire project graph for errors.
   * @param projectGraph The project graph to analyze.
   * @returns A list of all errors found.
   */
  public detectErrors(projectGraph: ProjectGraph): AnalysisError[] {
    let allErrors: AnalysisError[] = [];

    for (const file of projectGraph.files.values()) {
      const fileErrors = this.detectUnresolvedIdentifiers(file.ast, file.symbolTable);
      allErrors = allErrors.concat(fileErrors);
    }

    return allErrors;
  }

  /**
   * A rule to detect identifiers that are used but not defined in the symbol table.
   * @param ast The AST of the file to analyze.
   * @param symbolTable The symbol table for the file.
   * @returns A list of errors found in the file.
   */
  private detectUnresolvedIdentifiers(ast, symbolTable: SymbolTable): AnalysisError[] {
    const errors: AnalysisError[] = [];
    const rootNode = ast.nodes.get(ast.rootId);

    if (rootNode) {
      this.traverseForUsage(rootNode, ast.nodes, symbolTable, errors);
    }

    return errors;
  }

  /**
   * Traverses the AST to find identifier usages and check if they are in the symbol table.
   * @param node The current node to inspect.
   * @param allNodes A map of all nodes in the AST.
   * @param symbolTable The symbol table for the file.
   * @param errors The list of errors being built.
   */
  private traverseForUsage(
    node: CanonicalNode,
    allNodes: Map<string, CanonicalNode>,
    symbolTable: SymbolTable,
    errors: AnalysisError[],
  ): void {
    // We are looking for identifiers that are NOT part of a declaration.
    if (node.type === CanonicalNodeType.IDENTIFIER) {
      // This is a naive check. A real implementation would need to check parent nodes
      // to ensure this isn't a declaration itself.
      if (!symbolTable.symbols.has(node.text)) {
        errors.push({
          code: ErrorCode.UNRESOLVED_IDENTIFIER,
          message: `Unresolved identifier: ${node.text}`,
          filePath: node.filePath,
          nodeId: node.id,
        });
      }
    }

    for (const childId of node.children) {
      const childNode = allNodes.get(childId);
      if (childNode) {
        this.traverseForUsage(childNode, allNodes, symbolTable, errors);
      }
    }
  }
}
