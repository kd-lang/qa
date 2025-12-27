import { RawAst, RawNode } from '../parser/raw-ast';
import { CanonicalAst, CanonicalNode, Point } from './canonical-ast';
import { LanguageMappingService } from '../language/language-mapping.service';

// A simple utility to generate a unique ID for a node.
const generateId = (filePath: string, startOffset: number) => `${filePath}#${startOffset}`;

/**
 * A service to convert a language-specific RawAst to a language-agnostic CanonicalAst.
 * It uses a LanguageMappingService to determine the role and language of each node.
 */
export class CanonicalAstService {
  private readonly mappingService = new LanguageMappingService();

  /**
   * Converts a RawAst to a CanonicalAst.
   * @param rawAst The RawAst to convert.
   * @returns A new CanonicalAst.
   */
  public convert(rawAst: RawAst): CanonicalAst {
    const nodes = new Map<string, CanonicalNode>();
    const rootId = this.convertNode(rawAst.rootNode, rawAst.filePath, nodes);

    return {
      filePath: rawAst.filePath,
      rootId,
      nodes,
    };
  }

  /**
   * Recursively converts a RawNode to a CanonicalNode and adds it to the node map.
   * @param rawNode The RawNode to convert.
   * @param filePath The path of the file the node belongs to.
   * @param nodes The map of nodes being built.
   * @returns The ID of the newly created CanonicalNode.
   */
  private convertNode(rawNode: RawNode, filePath: string, nodes: Map<string, CanonicalNode>): string {
    const nodeId = generateId(filePath, rawNode.startPosition.offset);

    // Avoid reprocessing if already converted (e.g., through a different traversal path)
    if (nodes.has(nodeId)) {
      return nodeId;
    }

    const { language, role } = this.mappingService.getMapping(rawNode.type);

    // First, create and save the node for the current level to allow children to reference it.
    const partialNode: CanonicalNode = {
      id: nodeId,
      language,
      role,
      type: rawNode.type,
      text: rawNode.text,
      filePath,
      startPosition: { row: rawNode.startPosition.line, column: rawNode.startPosition.column },
      endPosition: { row: rawNode.endPosition.line, column: rawNode.endPosition.column },
      children: [], // Children will be added below
    };

    nodes.set(nodeId, partialNode);

    // Now, recursively convert children and collect their IDs.
    const childIds = rawNode.children.map(childNode => this.convertNode(childNode, filePath, nodes));
    
    // Update the node with its children.
    partialNode.children = childIds;

    return nodeId;
  }
}
