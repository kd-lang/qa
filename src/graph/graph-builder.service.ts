import { RawAst } from '../parser/raw-ast';

/**
 * Represents the entire project as a graph.
 * For now, it's a collection of ASTs.
 */
export interface ProjectGraph {
  asts: RawAst[];
}

/**
 * A service to build a project-wide graph from a collection of ASTs.
 */
export class GraphBuilderService {
  /**
   * Builds a project graph from a list of raw ASTs.
   * @param asts The list of ASTs to include in the graph.
   * @returns A ProjectGraph.
   */
  public buildGraph(asts: RawAst[]): ProjectGraph {
    // For now, the graph is just a container for the ASTs.
    // In the future, this is where we will add edges for dependencies between files.
    return { asts };
  }
}
