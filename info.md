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

The tool is executed from the command line and requires one argument: the path to the project directory to be analyzed.

*   **Syntax:**
    ```bash
    npm start <project-path>
    ```

### 3. Test Cases

*   **Test Case 1: Successful Project Analysis**
    *   **Objective:** Verify that the tool can correctly scan a project directory, parse all supported files (TypeScript, Python, Java), and generate a unified project graph.
    *   **Command:** To analyze the current project:
        ```bash
        npm start .
        ```
    *   **Expected Output:** The console should display a JSON object representing the project graph. This graph will contain the ASTs for all the `.ts`, `.py`, and `.java` files found in the project directory.

*   **Test Case 2: Directory Not Found**
    *   **Objective:** Verify that the tool handles cases where the input directory does not exist.
    *   **Command:**
        ```bash
        npm start non_existent_dir
        ```
    *   **Expected Output:** The application should print an error message to the console and exit gracefully.

## Non-Functional Requirements Testing

### 1. Performance

*   **Objective:** The tool should be able to parse and process projects of a reasonable size in a timely manner.
*   **Test:**
    1.  Run the tool against a large project with many files.
    2.  Measure the execution time.
    ```bash
    time npm start <large-project-path>
    ```
*   **Expected Result:** The execution time should be acceptable and scale reasonably with the size of the project.

### 2. Scalability

*   **Objective:** The application's performance should not degrade significantly as the number of files or the size of the ASTs increases.
*   **Test:**
    1.  Run the tool against projects of varying sizes and complexities.
    2.  Observe the memory usage and execution time.
*   **Expected Result:** Memory usage and execution time should grow linearly with the size and complexity of the project.
