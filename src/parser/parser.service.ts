
import Parser = require('tree-sitter');
import TypeScript = require('tree-sitter-typescript');
import { readFileSync } from 'fs';
import { RawAst, syntaxNodeToRawNode } from './raw-ast';

/**
 * Service for parsing source code files into Raw Abstract Syntax Trees (ASTs).
 * This service is responsible for loading the appropriate grammar and parsing the file content.
 */
export class ParserService {
  private readonly parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  /**
   * Parses a source code file and returns a RawAst.
   * @param filePath The path to the file to parse.
   * @param language The language of the file.
   * @returns A RawAst representing the parsed file, or undefined if parsing fails.
   */
  public parse(filePath: string, language: 'typescript' | 'tsx'): RawAst | undefined {
    try {
      const languageGrammar = this.getLanguage(language);
      if (!languageGrammar) {
        console.error(`Grammar for language "${language}" is not supported.`);
        return undefined;
      }

      this.parser.setLanguage(languageGrammar);
      const fileContent = readFileSync(filePath, 'utf8');
      const tree = this.parser.parse(fileContent);

      return {
        filePath,
        language,
        rootNode: syntaxNodeToRawNode(tree.rootNode),
      };
    } catch (error) {
      console.error(`Error parsing file ${filePath}:`, error);
      return undefined;
    }
  }

  /**
   * Retrieves the Tree-sitter grammar for a given language.
   * The 'tree-sitter-typescript' package exports an object with 'typescript' and 'tsx' properties.
   * @param language The language to get the grammar for.
   * @returns The Tree-sitter grammar, or undefined if the language is not supported.
   */
  private getLanguage(language: 'typescript' | 'tsx'): any {
    const grammars = TypeScript as any;
    switch (language) {
      case 'typescript':
        return grammars.typescript;
      case 'tsx':
        return grammars.tsx;
      default:
        return undefined;
    }
  }
}
