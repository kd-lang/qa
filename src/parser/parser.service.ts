import Parser from 'tree-sitter';
import { readFileSync } from 'fs';
import { RawAst, RawNode, Point } from './raw-ast';

// Correctly import the language grammars
const Languages = {
  typescript: require('tree-sitter-typescript').typescript,
  python: require('tree-sitter-python'),
  java: require('tree-sitter-java'),
};

export type SupportedLanguage = keyof typeof Languages;

/**
 * A service responsible for parsing source code into a Raw Abstract Syntax Tree (AST).
 * It uses the tree-sitter library to support multiple programming languages.
 */
export class ParserService {
  /**
   * Parses a source code file into a RawAst.
   * @param filePath The path to the file to be parsed.
   * @param language The programming language of the file.
   * @returns A RawAst object, or null if parsing fails or the language is unsupported.
   */
  public parse(filePath: string, language: SupportedLanguage): RawAst | null {
    const parser = new Parser();

    const grammar = Languages[language];
    if (!grammar) {
      console.error(`Unsupported language: ${language}. Supported languages are: ${Object.keys(Languages).join(', ')}`);
      return null;
    }
    parser.setLanguage(grammar);

    try {
      const sourceCode = readFileSync(filePath, 'utf8');
      const tree = parser.parse(sourceCode);

      const rootNode = this.buildRawNode(tree.rootNode);

      return {
        filePath,
        language,
        rootNode,
      };
    } catch (error) {
      console.error(`Error parsing file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Recursively converts a tree-sitter Node into a serializable RawNode.
   * @param node The tree-sitter Node to convert.
   * @returns A RawNode.
   */
  private buildRawNode(node: Parser.SyntaxNode): RawNode {
    return {
      type: node.type,
      text: node.text,
      startPosition: this.toPoint(node.startPosition),
      endPosition: this.toPoint(node.endPosition),
      startByte: node.startIndex,
      endByte: node.endIndex,
      children: node.namedChildren.map(child => this.buildRawNode(child)),
    };
  }

  /**
   * Converts a tree-sitter Point to a serializable Point object.
   * @param point The tree-sitter Point.
   * @returns A serializable Point.
   */
  private toPoint(point: Parser.Point): Point {
    return { row: point.row, column: point.column };
  }
}
