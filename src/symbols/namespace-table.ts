/**
 * A registry of all known namespaces (packages, modules) in the project.
 */
export interface NamespaceTable {
  java: Set<string>;
  python: Set<string>;
  typescript: Set<string>;
}
