import { ParserService } from './parser/parser.service';
import { CanonicalizationService } from './canonical/canonicalization.service';
import { QueryService } from './query/query.service';
import { CanonicalNodeType } from './canonical/canonical-ast';

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error('Usage: npm start <file-path> <language>');
    process.exit(1);
  }

  const [filePath, language] = args;

  // Phase 1: Parsing
  const parserService = new ParserService();
  const rawAst = parserService.parse(filePath, language);

  if (!rawAst) {
    console.error('Failed to parse the file.');
    return;
  }

  // Phase 2: Canonicalization
  const canonicalizationService = new CanonicalizationService();
  const canonicalAst = canonicalizationService.canonicalize(rawAst);

  // Phase 3: Querying
  console.log('Querying for all import statements...');
  const queryService = new QueryService(canonicalAst);
  const importNodes = queryService.findByType(CanonicalNodeType.IMPORT_STATEMENT);

  if (importNodes.length > 0) {
    console.log(`Found ${importNodes.length} import statement(s):`);
    importNodes.forEach(node => {
      console.log(`- Import statement: "${node.text}" at ${node.filePath}:${node.startPosition.row + 1}`);
    });
  } else {
    console.log('No import statements were found.');
  }
}

main().catch(error => {
  console.error('An unexpected error occurred:', error);
});
