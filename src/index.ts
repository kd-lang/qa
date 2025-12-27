import { ProjectAnalysisService } from './project/project-analysis.service';
import { CanonicalAstService } from './canonical/canonical-ast.service';
import { GraphBuilderService } from './graph/graph-builder.service';
import { RuleBasedErrorDetector } from './error-detector/error-detector.service';
import { SymbolExtractionService } from './symbols/symbol-extraction.service';
import { NamespaceTable } from './symbols/namespace-table';
import { ProjectGraph } from './graph/project-graph';
import { AnalysisError } from './error-detector/analysis-error';

// A custom replacer for JSON.stringify to handle Maps and Sets.
const replacer = (key, value) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  } else if (value instanceof Set) {
    return {
      dataType: 'Set',
      value: Array.from(value),
    };
  }
  return value;
};

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Usage: npm start <project-path>');
    process.exit(1);
  }

  const [projectPath] = args;

  console.log(`Analyzing project at: ${projectPath}`);

  // --- Phase 1: Registration ---

  // 1. Get all raw ASTs
  const analysisService = new ProjectAnalysisService();
  const rawAsts = analysisService.analyzeProject(projectPath);

  if (rawAsts.length === 0) {
    console.warn('No supported source files found in the project.');
    return;
  }

  // 2. Convert to Canonical ASTs with roles and languages
  const canonicalAstService = new CanonicalAstService();
  const canonicalAsts = rawAsts.map(rawAst => canonicalAstService.convert(rawAst));

  // 3. Build the graph, registering namespaces and symbols
  const graphBuilder = new GraphBuilderService();
  const symbolExtractor = new SymbolExtractionService();
  const namespaces: NamespaceTable = { java: new Set(), python: new Set(), typescript: new Set() };
  
  const projectGraph: ProjectGraph = graphBuilder.buildGraph(canonicalAsts, symbolExtractor, namespaces);

  // --- Phase 2: Resolution ---

  // 4. Run the error detector on the now-complete project graph
  const errorDetector = new RuleBasedErrorDetector();
  const errors: AnalysisError[] = errorDetector.detectErrors(projectGraph.files.values());

  // --- Final Output ---

  // 5. Serialize the results to JSON
  const output = {
    projectGraph,
    errors,
  };

  console.log('Analysis complete:');
  console.log(JSON.stringify(output, replacer, 2));
}

main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});
