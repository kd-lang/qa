import { createHash } from 'crypto';
import { RawAst, RawNode } from '../parser/raw-ast';
import { CanonicalAst, CanonicalNode, CanonicalNodeType } from './canonical-ast';

/**
 * A service responsible for converting a RawAst into a CanonicalAst.
 * This process involves normalizing node types and generating stable IDs.
 */
export class CanonicalizationService {

  /**
   * Normalizes a RawAst into a language-agnostic, deterministic CanonicalAst.
   * @param rawAst The RawAst to be normalized.
   * @returns A new CanonicalAst.
   */
  public canonicalize(rawAst: RawAst): CanonicalAst {
    const nodes = new Map<string, CanonicalNode>();
    const rootId = this.processNode(rawAst.rootNode, rawAst.filePath, nodes);

    return {
      rootId,
      filePath: rawAst.filePath,
      nodes,
    };
  }

  /**
   * Recursively processes a RawNode, converts it to a CanonicalNode, and adds it to the map.
   * @param rawNode The RawNode to process.
   * @param filePath The path of the file the node belongs to.
   * @param nodes The map to which the new CanonicalNode will be added.
   * @param parentId The ID of the parent node, if any.
   * @returns The stable ID of the newly created CanonicalNode.
   */
  private processNode(
    rawNode: RawNode,
    filePath: string,
    nodes: Map<string, CanonicalNode>,
    parentId?: string
  ): string {
    const canonicalType = this.mapToCanonicalType(rawNode.type);
    const id = this.generateStableId(rawNode, filePath, parentId);

    const childrenIds = rawNode.children.map(child =>
      this.processNode(child, filePath, nodes, id)
    );

    const canonicalNode: CanonicalNode = {
      id,
      type: canonicalType,
      filePath,
      text: rawNode.text,
      startPosition: rawNode.startPosition,
      endPosition: rawNode.endPosition,
      children: childrenIds,
    };

    nodes.set(id, canonicalNode);
    return id;
  }

  /**
   * Generates a deterministic SHA-256 hash for a node.
   * The hash is based on file path, node type, source position, and parent ID.
   * @param rawNode The RawNode to generate an ID for.
   * @param filePath The file path of the node.
   * @param parentId The ID of the parent node.
   * @returns A stable SHA-256 hash.
   */
  private generateStableId(rawNode: RawNode, filePath: string, parentId?: string): string {
    const hash = createHash('sha256');
    const data = `${filePath}:${rawNode.type}:${rawNode.startByte}:${rawNode.endByte}:${parentId || ''}`;
    hash.update(data);
    return hash.digest('hex');
  }

  /**
   * Maps a language-specific node type (from tree-sitter) to a CanonicalNodeType.
   * @param specificType The language-specific type string.
   * @returns The corresponding CanonicalNodeType.
   */
  private mapToCanonicalType(specificType: string): CanonicalNodeType {
    switch (specificType) {
      case 'program':
        return CanonicalNodeType.PROGRAM;
      case 'import_statement':
        return CanonicalNodeType.IMPORT_STATEMENT;
      case 'import_clause':
        return CanonicalNodeType.IMPORT_CLAUSE;
      case 'named_imports':
        return CanonicalNodeType.NAMED_IMPORTS;
      case 'import_specifier':
        return CanonicalNodeType.IMPORT_SPECIFIER;
      case 'namespace_import':
        return CanonicalNodeType.NAMESPACE_IMPORT;
      case 'lexical_declaration':
        return CanonicalNodeType.LEXICAL_DECLARATION;
      case 'variable_declaration':
        return CanonicalNodeType.VARIABLE_DECLARATION;
      case 'variable_declarator':
        return CanonicalNodeType.VARIABLE_DECLARATOR;
      case 'function_declaration':
        return CanonicalNodeType.FUNCTION_DECLARATION;
      case 'class_declaration':
        return CanonicalNodeType.CLASS_DECLARATION;
      case 'expression_statement':
        return CanonicalNodeType.EXPRESSION_STATEMENT;
      case 'if_statement':
        return CanonicalNodeType.IF_STATEMENT;
      case 'switch_statement':
        return CanonicalNodeType.SWITCH_STATEMENT;
      case 'for_statement':
        return CanonicalNodeType.FOR_STATEMENT;
      case 'while_statement':
        return CanonicalNodeType.WHILE_STATEMENT;
      case 'do_statement':
        return CanonicalNodeType.DO_STATEMENT;
      case 'return_statement':
        return CanonicalNodeType.RETURN_STATEMENT;
      case 'statement_block':
        return CanonicalNodeType.STATEMENT_BLOCK;
      case 'call_expression':
        return CanonicalNodeType.CALL_EXPRESSION;
      case 'member_expression':
        return CanonicalNodeType.MEMBER_EXPRESSION;
      case 'comment':
        return CanonicalNodeType.COMMENT;
      case 'string':
      case 'number':
      case 'true':
      case 'false':
        return CanonicalNodeType.LITERAL;
      case 'identifier':
        return CanonicalNodeType.IDENTIFIER;
      case 'property_identifier':
        return CanonicalNodeType.PROPERTY_IDENTIFIER;
      case 'arguments':
        return CanonicalNodeType.ARGUMENTS;
      case 'formal_parameters':
        return CanonicalNodeType.FORMAL_PARAMETERS;
      case 'arrow_function':
        return CanonicalNodeType.ARROW_FUNCTION;
      case 'type_annotation':
        return CanonicalNodeType.TYPE_ANNOTATION;
      case 'type_identifier':
        return CanonicalNodeType.TYPE_IDENTIFIER;
      case 'string_fragment':
        return CanonicalNodeType.STRING_FRAGMENT;
      default:
        throw new Error(`Unknown node type: '${specificType}'`);
    }
  }
}
