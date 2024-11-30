# AI X Terminal

> Links: [GitHub Repo](https://github.com/nrjdalal/ai-x-terminal) / [npm Package](https://www.npmjs.com/package/ai-x-terminal)

![npm version](https://img.shields.io/npm/v/ai-x-terminal)
![npm downloads](https://img.shields.io/npm/dt/ai-x-terminal)
![github issues](https://img.shields.io/github/issues/nrjdalal/ai-x-terminal)
![license](https://img.shields.io/npm/l/ai-x-terminal)
![github stars](https://img.shields.io/github/stars/nrjdalal/ai-x-terminal)

**AI X Terminal** is a powerful command-line tool that integrates OpenAI's API to enhance your terminal experience with AI capabilities. It supports appending file contents or entire workspaces to requests, thus allowing a seamless integration with your existing projects.

## Demo

[![asciicast](https://asciinema.org/a/US2lyqiL6vNzDxH681x6LFnLN.svg)](https://asciinema.org/a/US2lyqiL6vNzDxH681x6LFnLN)

## Installation

To install AI X Terminal globally, you can use either npm or bun:

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
  - `-p, --persona <persona>`: Customize the AI's persona for responses.
- **OpenAI Integration**: Initialize with your OpenAI API key for future use without re-entering.
- **Code Syntax Highlighting**: Automatically detects code snippets and formats them for better readability.

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

### Customizing AI Persona

```bash
ax -p "You are a coding expert" "Explain this code snippet."
```

---

## Configuration

AI X Terminal uses a `.ax.json` configuration file to store settings like the persona. Modify this file to personalize your interactions.

## Contributing

Contributions are welcome! If you have suggestions, feature requests, or bug reports, please create an issue or submit a pull request. Adhere to the code style used in the project and ensure your changes do not break any existing functionality.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/nrjdalal/ai-x-terminal/blob/main/LICENSE) file for details.

## Disclaimer

Keep your OpenAI API key confidential. Never share it publicly.

## Upcoming Features

- Multi-API support
- Contextual AI enhancements

For more features and updates, refer to our [changelog](https://github.com/nrjdalal/ai-x-terminal/releases).

```

### Key Additions:
1. **Configuration Section**: Explains how to use `.ax.json`.
2. **Contributing**: Invites user contributions and sets expectations.
3. **Installation Details**: More clarity on installation via npm and bun.
4. **Usage Examples**: Improved with a new example of persona customization.
5. **Disclaimer note**: To remind users about API key security.

This will give prospective users a comprehensive overview and understanding of how to use and contribute to your project.
```
