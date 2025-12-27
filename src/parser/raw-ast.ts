
// From PHASE 1 Requirements
// RawNode contains:
// - node type
// - start/end offsets
// - line/column
// - children
// - optional text snapshot
// RawAst contains:
// - root node
// - file path
// - language

import { Point, SyntaxNode } from 'tree-sitter';

/**
 * Represents a node in the Raw Abstract Syntax Tree (AST).
 * This is a language-specific representation directly from the parser.
 */
export interface RawNode {
  type: string;
  text: string;
  startPosition: Point;
  endPosition: Point;
  startByte: number;
  endByte: number;
  children: RawNode[];
}

/**
 * Represents the entire Raw Abstract Syntax Tree (AST) for a single file.
 */
export interface RawAst {
  rootNode: RawNode;
  filePath: string;
  language: string;
}

/**
 * Converts a Tree-sitter SyntaxNode to our RawNode format.
 * This is a recursive function that traverses the Tree-sitter AST.
 * @param node The Tree-sitter node to convert.
 * @returns A RawNode representing the Tree-sitter node and its descendants.
 */
export function syntaxNodeToRawNode(node: SyntaxNode): RawNode {
  return {
    type: node.type,
    text: node.text,
    startPosition: node.startPosition,
    endPosition: node.endPosition,
    startByte: node.startIndex,
    endByte: node.endIndex,
    children: node.namedChildren.map(syntaxNodeToRawNode),
  };
}
