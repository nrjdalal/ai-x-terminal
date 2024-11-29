# AI X Terminal

> Links: [github repo](https://github.com/nrjdalal/ai-x-terminal) / [npm package](https://www.npmjs.com/package/ai-x-terminal)

![npm version](https://img.shields.io/npm/v/ai-x-terminal)
![npm downloads](https://img.shields.io/npm/dt/ai-x-terminal)
![github issues](https://img.shields.io/github/issues/nrjdalal/ai-x-terminal)
![license](https://img.shields.io/npm/l/ai-x-terminal)
![github stars](https://img.shields.io/github/stars/nrjdalal/ai-x-terminal)

**AI X Terminal** is a powerful command-line tool that integrates OpenAI's API to enhance your terminal experience with AI capabilities. It supports appending file contents or entire workspaces to requests, thus allowing a seamless integration with your existing projects.

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
  - `-ls, --list`: List all filenames in the current directory.
- **OpenAI Integration**: Initialize with your OpenAI API key for a secure future use.

## Usage Examples

### Basic Usage

```bash
ax "What is the meaning of life?"
```

### Using a File

```bash
ax -f example.txt "Summarize this file."
```

### Using the Current Workspace

```bash
ax -w "Provide an overview of this project."
```

### Listing Files

```bash
ax -ls "Which of these files are safe to delete?"
```

---

**Disclaimer**: Keep your API key confidential. Never share it publicly.

## Upcoming Features

- Set custom prompt
- Multiple API support
- Contextual AI

For more features and updates, refer to our [changelog](https://github.com/nrjdalal/ai-x-terminal/releases).
