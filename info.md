# How to Test This Application

This document provides instructions for testing the AST (Abstract Syntax Tree) processing tool.

## Functional Requirements Testing

### 1. Setup

*   **Install Dependencies:**
    ```bash
    npm install
    ```
*   **Build the Project:**
    ```bash
    npm run build
    ```

### 2. Running the Tool

The tool is executed from the command line and requires two arguments: the path to the file to be parsed and the language of the file.

*   **Syntax:**
    ```bash
    npm start <file-path> <language>
    ```

### 3. Test Cases

*   **Test Case 1: Successful Parsing and Querying**
    *   **Objective:** Verify that the tool can correctly parse a TypeScript file and identify all import statements.
    *   **Command:**
        ```bash
        npm start example.ts typescript
        ```
    *   **Expected Output:** The console should display a "success" message indicating that the import statements in `example.ts` have been found, along with the text and location of each statement.

*   **Test Case 2: File Not Found**
    *   **Objective:** Verify that the tool handles cases where the input file does not exist.
    *   **Command:**
        ```bash
        npm start non_existent_file.ts typescript
        ```
    *   **Expected Output:** The application should print an error message to the console indicating that the file could not be parsed and should exit gracefully.

*   **Test Case 3: Invalid Language**
    *   **Objective:** Verify that the tool handles cases where an unsupported language is provided.
    *   **Command:**
        ```bash
        npm start example.ts python
        ```
    *   **Expected Output:** The application should throw an error indicating that the language is not supported.

## Non-Functional Requirements Testing

### 1. Performance

*   **Objective:** The tool should be able to parse and process files of a reasonable size in a timely manner.
*   **Test:**
    1.  Create a large TypeScript file (e.g., >10,000 lines of code).
    2.  Run the tool against this file and measure the execution time.
    ```bash
    time npm start <large_file.ts> typescript
    ```
*   **Expected Result:** The execution time should be acceptable (e.g., under a few seconds).

### 2. Scalability

*   **Objective:** The application's performance should not degrade significantly as the number of nodes in the AST increases.
*   **Test:**
    1.  Generate TypeScript files of varying complexity (e.g., one with many simple functions, another with deeply nested classes).
    2.  Run the tool against each and observe the memory usage and execution time.
*   **Expected Result:** Memory usage and execution time should grow linearly with the size and complexity of the input file.

### 3. Security

*   **Objective:** Ensure that the tool is not vulnerable to common security threats.
*   **Test:**
    *   **Input Sanitization:** Attempt to use a malicious file path as an argument to see if it can be used to access unauthorized parts of the file system (e.g., `../../../some_secret_file`).
    ```bash
    npm start ../../../package.json typescript
    ```
*   **Expected Result:** The application should be restricted to the project directory and should not allow access to arbitrary file paths. *Note: The current implementation using Node.js's `fs` module is generally safe from trivial path traversal attacks, but this is a good practice to keep in mind.*
