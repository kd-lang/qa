import { RawAst } from '../parser/raw-ast';
import { CanonicalAst } from '../canonical/canonical-ast';
import { SymbolExtractionService } from '../symbols/symbol-extraction.service';
import { ProjectGraph, ProjectFile } from './project-graph';

/**
 * A service to build a project-wide graph from a collection of ASTs.
 */
export class GraphBuilderService {
  private readonly symbolExtractionService = new SymbolExtractionService();

  /**
   * Builds a rich, queryable project graph from a list of raw and canonical ASTs.
   * @param asts The list of canonical ASTs to include in the graph.
   * @returns A ProjectGraph.
   */
  public buildGraph(asts: CanonicalAst[]): ProjectGraph {
    const files = new Map<string, ProjectFile>();

    for (const ast of asts) {
      // 3. Extract symbols for each file
      const symbolTable = this.symbolExtractionService.extractSymbols(ast);

      const projectFile: ProjectFile = {
        filePath: ast.filePath,
        ast,
        symbolTable,
      };

      files.set(ast.filePath, projectFile);
    }

    return { files };
  }
}
