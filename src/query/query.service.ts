
import { CanonicalAst, CanonicalNode, CanonicalNodeType } from '../canonical/canonical-ast';

/**
 * A predicate function used for querying nodes.
 * It is called with each node in the AST.
 * @param node The CanonicalNode to evaluate.
 * @returns True if the node matches the predicate, false otherwise.
 */
export type NodePredicate = (node: CanonicalNode) => boolean;

/**
 * Provides a service for querying a CanonicalAst.
 * This allows for easy and efficient searching of nodes.
 */
export class QueryService {
  private readonly ast: CanonicalAst;

  constructor(ast: CanonicalAst) {
    this.ast = ast;
  }

  /**
   * Finds all nodes that match a given predicate.
   * @param predicate The predicate function to test each node.
   * @returns An array of CanonicalNodes that match the predicate.
   */
  public find(predicate: NodePredicate): CanonicalNode[] {
    const results: CanonicalNode[] = [];
    for (const node of this.ast.nodes.values()) {
      if (predicate(node)) {
        results.push(node);
      }
    }
    return results;
  }

  /**
   * A convenience method to find all nodes of a specific type.
   * @param type The CanonicalNodeType to search for.
   * @returns An array of CanonicalNodes of the specified type.
   */
  public findByType(type: CanonicalNodeType): CanonicalNode[] {
    return this.find(node => node.type === type);
  }

  /**
   * Finds a single node by its stable ID.
   * @param id The ID of the node to find.
   * @returns The CanonicalNode with the given ID, or undefined if not found.
   */
  public findById(id: string): CanonicalNode | undefined {
    return this.ast.nodes.get(id);
  }
}
