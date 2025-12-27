import { ProjectAnalysisService } from './project/project-analysis.service';
import { GraphBuilderService } from './graph/graph-builder.service';

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Usage: npm start <project-path>');
    process.exit(1);
  }

  const [projectPath] = args;

  console.log(`Analyzing project at: ${projectPath}`);

  // 1. Analyze the project and get all ASTs
  const analysisService = new ProjectAnalysisService();
  const asts = analysisService.analyzeProject(projectPath);

  if (asts.length === 0) {
    console.warn('No supported source files found in the project.');
    return;
  }

  console.log(`Found and parsed ${asts.length} files.`);

  // 2. Build the project graph
  const graphBuilder = new GraphBuilderService();
  const projectGraph = graphBuilder.buildGraph(asts);

  // 3. Output the project graph as JSON
  // This can be consumed by other tools and services.
  console.log('Project graph built successfully:');
  console.log(JSON.stringify(projectGraph, null, 2));
}

main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});
