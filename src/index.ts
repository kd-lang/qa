import { ProjectAnalysisService } from './project/project-analysis.service';
import { CanonicalAstService } from './canonical/canonical-ast.service';
import { GraphBuilderService } from './graph/graph-builder.service';
import { RuleBasedErrorDetector } from './error-detector/error-detector.service';
import { AnalysisError } from './error-detector/analysis-error';

// A custom replacer for JSON.stringify to handle Maps.
const replacer = (key, value) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
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

  // 1. Analyze the project to get all raw ASTs
  const analysisService = new ProjectAnalysisService();
  const rawAsts = analysisService.analyzeProject(projectPath);

  if (rawAsts.length === 0) {
    console.warn('No supported source files found in the project.');
    return;
  }

  // 2. Convert all raw ASTs to Canonical ASTs
  const canonicalAstService = new CanonicalAstService();
  const canonicalAsts = rawAsts.map(rawAst => canonicalAstService.convert(rawAst));

  // 3. Build the project graph with symbol tables
  const graphBuilder = new GraphBuilderService();
  const projectGraph = graphBuilder.buildGraph(canonicalAsts);

  // 4. Run the error detector on the project graph
  const errorDetector = new RuleBasedErrorDetector();
  const errors: AnalysisError[] = errorDetector.detectErrors(projectGraph);

  // 5. Output the results as JSON
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
