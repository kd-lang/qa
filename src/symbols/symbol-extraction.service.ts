import { CanonicalAst, CanonicalNode, CanonicalNodeType } from '../canonical/canonical-ast';
import { Symbol, SymbolTable, SymbolType } from './symbol-table';

/**
 * A service to extract symbols from a Canonical AST and build a SymbolTable.
 */
export class SymbolExtractionService {
  /**
   * Extracts all symbols from a given CanonicalAst.
   * @param ast The CanonicalAst to process.
   * @returns A SymbolTable for the given AST.
   */
  public extractSymbols(ast: CanonicalAst): SymbolTable {
    const symbols = new Map<string, Symbol>();
    const rootNode = ast.nodes.get(ast.rootId);

    if (rootNode) {
      this.traverse(rootNode, ast.nodes, symbols);
    }

    return { symbols };
  }

  /**
   * Traverses the Canonical AST to find and record symbol declarations.
   * @param node The current node to inspect.
   * @param allNodes A map of all nodes in the AST.
   * @param symbols The map of symbols being built.
   */
  private traverse(node: CanonicalNode, allNodes: Map<string, CanonicalNode>, symbols: Map<string, Symbol>): void {
    switch (node.type) {
      case CanonicalNodeType.FUNCTION_DECLARATION:
      case CanonicalNodeType.CLASS_DECLARATION:
      case CanonicalNodeType.VARIABLE_DECLARATION:
        this.addSymbol(node, symbols, allNodes);
        break;
    }

    for (const childId of node.children) {
      const childNode = allNodes.get(childId);
      if (childNode) {
        this.traverse(childNode, allNodes, symbols);
      }
    }
  }

  /**
   * Adds a new symbol to the symbol map.
   * @param node The node representing the symbol declaration.
   * @param symbols The map of symbols being built.
   * @param allNodes A map of all nodes in the AST.
   */
  private addSymbol(node: CanonicalNode, symbols: Map<string, Symbol>, allNodes: Map<string, CanonicalNode>): void {
    // The identifier is often the first child of a declaration.
    // This is a simplification and needs to be made more robust.
    const identifierNode = node.children.length > 0 ? allNodes.get(node.children[0]) : undefined;
    const name = identifierNode ? identifierNode.text : '[unknown]';

    const symbol: Symbol = {
      name,
      type: this.mapNodeTypeToSymbolType(node.type),
      nodeId: node.id,
      filePath: node.filePath,
    };

    // Use the symbol name as the key for now.
    // This will need to handle scopes in the future.
    symbols.set(name, symbol);
  }

  /**
   * Maps a CanonicalNodeType to a SymbolType.
   * @param nodeType The node type to map.
   * @returns The corresponding SymbolType.
   */
  private mapNodeTypeToSymbolType(nodeType: CanonicalNodeType): SymbolType {
    switch (nodeType) {
      case CanonicalNodeType.FUNCTION_DECLARATION:
        return SymbolType.FUNCTION;
      case CanonicalNodeType.CLASS_DECLARATION:
        return SymbolType.CLASS;
      case CanonicalNodeType.VARIABLE_DECLARATION:
        return SymbolType.VARIABLE;
      default:
        return SymbolType.UNKNOWN;
    }
  }
}
