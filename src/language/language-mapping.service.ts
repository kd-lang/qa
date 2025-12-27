import { Language, NodeRole } from '../canonical/canonical-ast';

/**
 * A service to map language-specific node types to their canonical role and language.
 */
export class LanguageMappingService {
  /**
   * Determines the Language and NodeRole for a given raw node type.
   * This is where the language-specific knowledge is encapsulated.
   *
   * @param rawType The node type from the underlying parser (e.g., 'class_declaration').
   * @returns An object containing the Language and NodeRole.
   */
  public getMapping(rawType: string): { language: Language; role: NodeRole } {
    // ** Java Mappings **
    if (rawType.startsWith('java:')) {
      const javaType = rawType.substring(5);
      switch (javaType) {
        case 'package_declaration':
        case 'import_declaration':
          return { language: Language.JAVA, role: NodeRole.MODULE_PATH };
        case 'class_declaration':
          return { language: Language.JAVA, role: NodeRole.TYPE_DECLARATION };
        case 'method_declaration':
          return { language: Language.JAVA, role: NodeRole.FUNCTION_DECLARATION };
        case 'variable_declarator':
        case 'local_variable_declaration':
          return { language: Language.JAVA, role: NodeRole.VARIABLE_DECLARATION };
        case 'type_identifier':
        case 'generic_type':
          return { language: Language.JAVA, role: NodeRole.TYPE_REFERENCE };
        case 'method_invocation':
          return { language: Language.JAVA, role: NodeRole.FUNCTION_CALL };
        case 'identifier':
          return { language: Language.JAVA, role: NodeRole.VARIABLE_REFERENCE }; // Default, may be refined
        case 'field_access':
          return { language: Language.JAVA, role: NodeRole.FIELD_REFERENCE };
        default:
          return { language: Language.JAVA, role: NodeRole.UNKNOWN };
      }
    }

    // ** TypeScript Mappings **
    if (rawType.startsWith('ts:')) {
      const tsType = rawType.substring(3);
      switch (tsType) {
        case 'import_statement':
          return { language: Language.TYPESCRIPT, role: NodeRole.MODULE_PATH };
        case 'class_declaration':
        case 'interface_declaration':
          return { language: Language.TYPESCRIPT, role: NodeRole.TYPE_DECLARATION };
        case 'function_declaration':
        case 'method_declaration':
          return { language: Language.TYPESCRIPT, role: NodeRole.FUNCTION_DECLARATION };
        case 'variable_declaration':
          return { language: Language.TYPESCRIPT, role: NodeRole.VARIABLE_DECLARATION };
        case 'type_reference':
          return { language: Language.TYPESCRIPT, role: NodeRole.TYPE_REFERENCE };
        case 'call_expression':
          return { language: Language.TYPESCRIPT, role: NodeRole.FUNCTION_CALL };
        case 'identifier':
          return { language: Language.TYPESCRIPT, role: NodeRole.VARIABLE_REFERENCE }; // Default
        case 'member_expression':
          return { language: Language.TYPESCRIPT, role: NodeRole.FIELD_REFERENCE };
        default:
          return { language: Language.TYPESCRIPT, role: NodeRole.UNKNOWN };
      }
    }

    // ** Python Mappings **
    if (rawType.startsWith('py:')) {
        const pyType = rawType.substring(3);
        switch(pyType) {
            case 'import_statement':
            case 'import_from_statement':
                return { language: Language.PYTHON, role: NodeRole.MODULE_PATH };
            case 'class_definition':
                return { language: Language.PYTHON, role: NodeRole.TYPE_DECLARATION };
            case 'function_definition':
                return { language: Language.PYTHON, role: NodeRole.FUNCTION_DECLARATION };
            case 'assignment':
            case 'typed_parameter':
                return { language: Language.PYTHON, role: NodeRole.VARIABLE_DECLARATION };
            case 'type':
                return { language: Language.PYTHON, role: NodeRole.TYPE_REFERENCE };
            case 'call':
                return { language: Language.PYTHON, role: NodeRole.FUNCTION_CALL };
            case 'identifier':
                return { language: Language.PYTHON, role: NodeRole.VARIABLE_REFERENCE }; // Default
            case 'attribute':
                return { language: Language.PYTHON, role: NodeRole.FIELD_REFERENCE };
            default:
                return { language: Language.PYTHON, role: NodeRole.UNKNOWN };
        }
    }

    return { language: Language.UNKNOWN, role: NodeRole.UNKNOWN };
  }
}
