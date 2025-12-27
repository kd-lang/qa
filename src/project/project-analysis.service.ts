import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { ParserService, SupportedLanguage } from '../parser/parser.service';
import { RawAst } from '../parser/raw-ast';

const LanguageExtensions: Record<string, SupportedLanguage> = {
  '.ts': 'typescript',
  '.py': 'python',
  '.java': 'java',
};

/**
 * A service to analyze an entire project, parsing all supported files within a directory.
 */
export class ProjectAnalysisService {
  private readonly parserService = new ParserService();

  /**
   * Analyzes a project directory and parses all supported files.
   * @param projectPath The root path of the project to analyze.
   * @returns An array of RawAst objects, one for each successfully parsed file.
   */
  public analyzeProject(projectPath: string): RawAst[] {
    const allFiles = this.getAllFiles(projectPath);
    const supportedFiles = allFiles.filter(file => LanguageExtensions[extname(file)]);

    const asts: RawAst[] = [];
    for (const file of supportedFiles) {
      const language = LanguageExtensions[extname(file)];
      const ast = this.parserService.parse(file, language);
      if (ast) {
        asts.push(ast);
      }
    }

    return asts;
  }

  /**
   * Recursively gets all file paths within a directory.
   * @param dirPath The directory to scan.
   * @returns A flat list of full file paths.
   */
  private getAllFiles(dirPath: string): string[] {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    const files = entries.map(entry => {
      const resolvedPath = join(dirPath, entry.name);
      // Exclude node_modules for efficiency
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        return this.getAllFiles(resolvedPath);
      } else {
        return resolvedPath;
      }
    });

    return Array.prototype.concat(...files);
  }
}
