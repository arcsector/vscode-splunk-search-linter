# Splunk Search Autocompletion Tool README

<img src="https://img.shields.io/badge/Downloads-40%2B-green">

This is the README for the Splunk Search Autocompletion Tool.

## Features

- Works on `.spl` and `.splunk` files
- Autocompleting commands
- Syntax for main, eval, and stats commands
- Hover for commands and keywords
- Description for commands
- Related main commands
- `Format SPL` VSCode command to format searches

<img src="https://raw.githubusercontent.com/arcsector/vscode-splunk-search-linter/master/.github/vscode_splunk_suggestion-main.png">

<img src="https://raw.githubusercontent.com/arcsector/vscode-splunk-search-linter/master/.github/vscode_splunk_suggestion-eval.png">

## How to install

### Prerequisites

**In order to install this extension you must have installed the [Splunk Search Syntax Highlighter](https://marketplace.visualstudio.com/items?itemName=arcsector.vscode-splunk-search-syntax). Please install it first before submitting an issue.**

### Install from Source

Install from source by downloading this repo and unzipping into your vscode extensions directory (ususally `~/.vscode/extensions`)

### Install in Visual Studio Code directly

Install directly in visual studio by going to the extensions tab and searching for `"splunk search"`. The quotes are imperative as the words are normally not treated as a phrase. Click the `Install` button on the  extension with the same name as this README and you're good to go.

## TODO

- [X] Syntax for main commands
- [X] Syntax for eval and stats commands
- [X] Description for commands
- [X] Related main commands
- [X] Add in suggestion after pipe, stats, and eval commands for respective commands
- [X] Add in suggestion after stats commands with arguments for keywords (AS, BY, OVER, WHERE, etc...)
- [ ] Instead of JSON files, get info directly from Splunk's website so that manual updating is not required
- [X] Implement hovers for all commands to increase syntax and description visibility
- [X] Publish to VSCE Marketplace
- [ ] Bundle with Syntax highlighter
