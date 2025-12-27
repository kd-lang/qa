import { RawAst, RawNode } from '../parser/raw-ast';
import { CanonicalAst, CanonicalNode, CanonicalNodeType, Point } from './canonical-ast';
import { v5 as uuidv5 } from 'uuid';

// A unique namespace for generating UUIDs for nodes.
const UUID_NAMESPACE = 'e8a4b5b0-779c-4aa3-a4e9-1585d5f7b8a7';

/**
 * A service responsible for converting a language-specific RawAst into a language-agnostic CanonicalAst.
 */
export class CanonicalAstService {
  /**
   * Converts a RawAst to a CanonicalAst.
   * @param rawAst The RawAst to convert.
   * @returns A CanonicalAst.
   */
  public convert(rawAst: RawAst): CanonicalAst {
    const nodes = new Map<string, CanonicalNode>();
    const rootId = this.convertNode(rawAst.rootNode, rawAst.filePath, nodes);

    return {
      rootId,
      filePath: rawAst.filePath,
      nodes,
    };
  }

  /**
   * Recursively converts a RawNode to a CanonicalNode and adds it to the map.
   * @param rawNode The RawNode to convert.
   * @param filePath The path of the file the node belongs to.
   * @param nodes The map of nodes being built.
   * @returns The ID of the newly created CanonicalNode.
   */
  private convertNode(rawNode: RawNode, filePath: string, nodes: Map<string, CanonicalNode>): string {
    // Create a deterministic, unique ID for the node.
    const id = uuidv5(`${filePath}:${rawNode.type}:${rawNode.startByte}:${rawNode.endByte}`, UUID_NAMESPACE);

    const children = rawNode.children.map(child => this.convertNode(child, filePath, nodes));

    const canonicalNode: CanonicalNode = {
      id,
      type: this.mapType(rawNode.type),
      text: rawNode.text,
      filePath,
      startPosition: rawNode.startPosition,
      endPosition: rawNode.endPosition,
      children,
    };

    nodes.set(id, canonicalNode);
    return id;
  }

  /**
   * Maps a language-specific node type to a CanonicalNodeType.
   * This is where the logic for different languages will go.
   * For now, it's a simple placeholder.
   * @param type The language-specific type string.
   * @returns A CanonicalNodeType.
   */
  private mapType(type: string): CanonicalNodeType {
    // This is a simplistic mapping and will need to be expanded significantly.
    switch (type) {
      case 'function_declaration':
      case 'function_definition':
        return CanonicalNodeType.FUNCTION_DECLARATION;
      case 'class_declaration':
      case 'class_definition':
        return CanonicalNodeType.CLASS_DECLARATION;
      case 'variable_declarator':
        return CanonicalNodeType.VARIABLE_DECLARATION;
      case 'import_statement':
        return CanonicalNodeType.IMPORT_STATEMENT;
      case 'call_expression':
        return CanonicalNodeType.CALL_EXPRESSION;
      case 'identifier':
        return CanonicalNodeType.IDENTIFIER;
      case 'comment':
        return CanonicalNodeType.COMMENT;
      default:
        return CanonicalNodeType.UNKNOWN;
    }
  }
}
