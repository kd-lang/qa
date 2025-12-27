import { CanonicalAst, CanonicalNode, NodeRole, Language } from '../canonical/canonical-ast';
import { ScopedSymbolTable, Symbol, SymbolType } from './symbol-table';
import { NamespaceTable } from './namespace-table';

/**
 * A service to extract symbols and namespaces from a Canonical AST.
 * This service performs the "Registration" phase of the analysis.
 */
export class SymbolExtractionService {
  /**
   * Extracts all symbols and namespaces from a given CanonicalAst.
   * @param ast The CanonicalAst to process.
   * @param namespaces The global NamespaceTable to populate.
   * @returns A ScopedSymbolTable for the given AST.
   */
  public extractSymbols(ast: CanonicalAst, namespaces: NamespaceTable): ScopedSymbolTable {
    const fileSymbols = new Map<string, Symbol>();
    const importedSymbols = new Map<string, Symbol>();
    const exportedSymbols = new Map<string, Symbol>(); // Future use

    const rootNode = ast.nodes.get(ast.rootId);

    if (rootNode) {
      this.traverseForRegistration(rootNode, ast.nodes, fileSymbols, importedSymbols, namespaces);
    }

    return { fileSymbols, importedSymbols, exportedSymbols };
  }

  /**
   * Traverses the Canonical AST to register namespaces, declarations, and imports.
   * @param node The current node to inspect.
   * @param allNodes A map of all nodes in the AST.
   * @param fileSymbols The map of symbols defined in the file.
   * @param importedSymbols The map of symbols imported into the file.
   * @param namespaces The global namespace table.
   */
  private traverseForRegistration(
    node: CanonicalNode,
    allNodes: Map<string, CanonicalNode>,
    fileSymbols: Map<string, Symbol>,
    importedSymbols: Map<string, Symbol>,
    namespaces: NamespaceTable,
  ): void {
    switch (node.role) {
      // 1. Register Namespaces
      case NodeRole.MODULE_PATH:
        this.registerNamespace(node, namespaces);
        break;

      // 2. Register Declarations
      case NodeRole.TYPE_DECLARATION:
      case NodeRole.FUNCTION_DECLARATION:
      case NodeRole.VARIABLE_DECLARATION:
        this.addSymbol(node, fileSymbols, allNodes);
        break;

      // 3. Register Import Targets
      case NodeRole.IMPORT_TARGET:
        this.addImportedSymbol(node, importedSymbols);
        break;
    }

    for (const childId of node.children) {
      const childNode = allNodes.get(childId);
      if (childNode) {
        this.traverseForRegistration(childNode, allNodes, fileSymbols, importedSymbols, namespaces);
      }
    }
  }

  /**
   * Registers a namespace in the appropriate language set.
   * @param node The node representing the namespace declaration (e.g., package, import).
   * @param namespaces The global namespace table.
   */
  private registerNamespace(node: CanonicalNode, namespaces: NamespaceTable): void {
    const namespacePath = node.text;
    switch (node.language) {
      case Language.JAVA:
        namespaces.java.add(namespacePath);
        break;
      case Language.PYTHON:
        namespaces.python.add(namespacePath);
        break;
      case Language.TYPESCRIPT:
        namespaces.typescript.add(namespacePath);
        break;
    }
  }

  /**
   * Adds a newly declared symbol to the file-scoped symbol map.
   * @param node The declaration node.
   * @param fileSymbols The map of symbols being built.
   * @param allNodes A map of all nodes in the AST.
   */
  private addSymbol(node: CanonicalNode, fileSymbols: Map<string, Symbol>, allNodes: Map<string, CanonicalNode>): void {
    // A more robust implementation would find the specific identifier child.
    const name = this.findPrimaryIdentifier(node, allNodes) || '[unknown_declaration]';

    const symbol: Symbol = {
      name,
      type: this.mapRoleToSymbolType(node.role),
      nodeId: node.id,
      filePath: node.filePath,
    };

    fileSymbols.set(name, symbol);
  }

  /**
   * Adds a symbol from an import statement to the imported symbol map.
   * @param node The node representing the imported symbol (the leaf of the import).
   * @param importedSymbols The map of imported symbols being built.
   */
  private addImportedSymbol(node: CanonicalNode, importedSymbols: Map<string, Symbol>): void {
    const name = node.text;

    const symbol: Symbol = {
      name,
      type: SymbolType.UNKNOWN, // We may not know the type from the import alone
      nodeId: node.id,
      filePath: node.filePath, // The file where the import occurs
    };

    importedSymbols.set(name, symbol);
  }

  private findPrimaryIdentifier(node: CanonicalNode, allNodes: Map<string, CanonicalNode>): string | null {
    // This is a heuristic. A robust implementation would need language-specific logic.
    // For many languages, the first identifier child of a declaration is the name.
    for(const childId of node.children) {
        const child = allNodes.get(childId);
        if(child && child.role === NodeRole.VARIABLE_REFERENCE) { // Or a more specific 'DECLARATION_IDENTIFIER' role
            return child.text;
        }
    }
    return node.text; // Fallback
  }


  /**
   * Maps a NodeRole to a SymbolType.
   * @param role The node role to map.
   * @returns The corresponding SymbolType.
   */
  private mapRoleToSymbolType(role: NodeRole): SymbolType {
    switch (role) {
      case NodeRole.TYPE_DECLARATION:
        return SymbolType.CLASS;
      case NodeRole.FUNCTION_DECLARATION:
        return SymbolType.FUNCTION;
      case NodeRole.VARIABLE_DECLARATION:
        return SymbolType.VARIABLE;
      default:
        return SymbolType.UNKNOWN;
    }
  }
}
