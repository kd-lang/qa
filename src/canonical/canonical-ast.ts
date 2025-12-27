/**
 * @fileoverview Defines the language-agnostic, canonical abstract syntax tree (AST).
 * This AST is designed to be deterministic and comparable across different languages.
 */

/**
 * An enumeration of the canonical node types. 
 * These types are designed to be language-agnostic.
 */
export enum CanonicalNodeType {

  // Top-level constructs
  PROGRAM = 'PROGRAM',
  IMPORT_STATEMENT = 'IMPORT_STATEMENT',
  EXPORT_STATEMENT = 'EXPORT_STATEMENT',
  FUNCTION_DECLARATION = 'FUNCTION_DECLARATION',
  CLASS_DECLARATION = 'CLASS_DECLARATION',

  // Imports
  IMPORT_CLAUSE = 'IMPORT_CLAUSE',
  NAMED_IMPORTS = 'NAMED_IMPORTS',
  IMPORT_SPECIFIER = 'IMPORT_SPECIFIER',
  NAMESPACE_IMPORT = 'NAMESPACE_IMPORT',

  // Declarations
  VARIABLE_DECLARATION = 'VARIABLE_DECLARATION',
  VARIABLE_DECLARATOR = 'VARIABLE_DECLARATOR',
  LEXICAL_DECLARATION = 'LEXICAL_DECLARATION',

  // Statements
  EXPRESSION_STATEMENT = 'EXPRESSION_STATEMENT',
  IF_STATEMENT = 'IF_STATEMENT',
  SWITCH_STATEMENT = 'SWITCH_STATEMENT',
  FOR_STATEMENT = 'FOR_STATEMENT',
  WHILE_STATEMENT = 'WHILE_STATEMENT',
  DO_STATEMENT = 'DO_STATEMENT',
  RETURN_STATEMENT = 'RETURN_STATEMENT',
  STATEMENT_BLOCK = 'STATEMENT_BLOCK',

  // Expressions
  CALL_EXPRESSION = 'CALL_EXPRESSION',
  MEMBER_EXPRESSION = 'MEMBER_EXPRESSION',
  LITERAL = 'LITERAL',
  IDENTIFIER = 'IDENTIFIER',
  PROPERTY_IDENTIFIER = 'PROPERTY_IDENTIFIER',
  ARGUMENTS = 'ARGUMENTS',
  FORMAL_PARAMETERS = 'FORMAL_PARAMETERS',
  ARROW_FUNCTION = 'ARROW_FUNCTION',

  // Types
  TYPE_ANNOTATION = 'TYPE_ANNOTATION',
  TYPE_IDENTIFIER = 'TYPE_IDENTIFIER',

  // Literals
  STRING_FRAGMENT = 'STRING_FRAGMENT', // content of a string

  // Comments
  COMMENT = 'COMMENT',
}

/**
 * Represents a node in the CanonicalAst.
 */
export interface CanonicalNode {
  id: string; // A unique, deterministic ID for the node
  type: CanonicalNodeType; // The canonical type of the node
  text: string; // The source text of the node
  filePath: string; // The file path of the source file
  startPosition: { row: number; column: number }; // The start position of the node in the source file
  endPosition: { row: number; column: number }; // The end position of the node in the source file
  children: string[]; // An array of child node IDs
}

/**
 * Represents the entire canonical abstract syntax tree for a given file.
 */
export interface CanonicalAst {
  rootId: string; // The ID of the root node
  filePath: string; // The file path of the source file
  nodes: Map<string, CanonicalNode>; // A map of node IDs to CanonicalNode objects
}
