# AI X Terminal

**AI X Terminal** is a command-line tool that leverages OpenAI's API to enhance your terminal experience with AI capabilities. With options to append file contents or entire workspaces to requests, AI Terminal facilitates seamless integration with your current projects.

## Installation

```bash
npm install -g ai-x-terminal
```

OR

```bash
bun add -g ai-x-terminal
```

## Features

- **Command Line Arguments**: Use the tool with various options to customize its behavior.

  - `-f, --file <file>`: Append specified file content to the AI prompt.
  - `-w, --workspace`: Append contents of all files in the current directory to the prompt.

- **OpenAI Integration**:
  - Upon first run, you will be prompted to input your OpenAI API key, which will be securely stored for future use.

### Configuration

- On the first run, you will be asked to input your OpenAI API key. This key is securely stored on your machine for future requests.

- It's crucial to ensure your API key is kept confidential, as it provides access to the OpenAI services.

These examples should help users understand how to effectively leverage the `AI X Terminal` tool for various use cases in their projects. Adjust and expand these examples based on user feedback and specific functionalities of your tool.

## Usage Examples

After installing AI X Terminal globally, you can use it via the command line as demonstrated below:

#### Basic Usage

To use the AI X Terminal for a simple command, just type:

```bash
ax "What is the purpose of life?"
```

This will prompt the AI to answer your query based on the supplied string.

#### Using a File

You can append the content of a specific file to the AI request. This is especially useful if you want the AI's response to consider the context or information contained within a file.

```bash
ax -f example.txt "Summarize this file."
```

In this example, `example.txt` is read by the AI, and it provides a summary based on the file contents.

#### Using the Current Workspace

If you want the AI to consider all files within the current directory, use the workspace option:

```bash
ax -w "Provide an overview of this project."
```

This command will read all files in the current directory and generate a response based on the combined contents of those files.

### Advanced Examples

1. **Combining File and Message**: If you want to analyze a specific file along with providing a custom message:

   ```bash
   ax -f README.md "Analyze the structure and suggest improvements."
   ```

2. **Workspace Analysis**: For comprehensive feedback across all files in a directory:

   ```bash
   ax -w "Review this codebase and identify potential optimizations."
   ```

## Note

Feel free to contribute or raise issues if you encounter any!

---

**Disclaimer**: Make sure to keep your API key confidential and never share it publicly.
