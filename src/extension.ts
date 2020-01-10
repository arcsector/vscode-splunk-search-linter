// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { returnCompletionItemfromJSON } from './splunkParser';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-splunk-search-linter" is now active!');
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	});

	// Define document selector
	let splunkSelector:vscode.DocumentSelector = {
		scheme: 'file',
		language: 'splunk'
	};
	const mainFunctions = returnCompletionItemfromJSON(context, 'Command_description_Related_table');
	const evalFunctions = returnCompletionItemfromJSON(context, 'eval_functions-syntax_description_type');
	const statsFunctions = returnCompletionItemfromJSON(context, 'stats_functions-syntax_description_type');

	// Here we will start our Completion provider
	let splunkProvider = vscode.languages.registerCompletionItemProvider(splunkSelector, {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			//a simple item which inserts "hello world"
			const simpleCompletion = new vscode.CompletionItem('hello world');
			simpleCompletion.detail = "Simple Completion Detail";
			simpleCompletion.documentation = new vscode.MarkdownString("### Simple Completion Documentaion:\n`I` can _probably_ **see** markdown, but can i see [hyperlinks](https://google.com)?");
			//simpleCompletion.kind = vscode.CompletionItemKind.Keyword;
			//simpleCompletion.label = "Simple Completion Label";

			// a completion item that inserts it's text as a snippet, the `insertText` property is a 
			// `SnippetString` which will be honored by the editor. 
			const snippetCompletion = new vscode.CompletionItem('Good part of the day');
			snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
			snippetCompletion.documentation = new vscode.MarkdownString("Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.");

			// a completion item that can be accepted by a commit character, the `commitCharacters` property is set
			// which means that the completion will be inserted and then the character will be typed
			const commitCharacterCompletion = new vscode.CompletionItem('console');
			commitCharacterCompletion.commitCharacters = ['.'];
			commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');

			// a completion item that retriggers IntelliSense when being accepted,  the `command`-property 
			// is set which the editor will execute after completion has been inserted. Also, the 
			// `insertText` is set so that a space is inserted after `new`
			const commandCompletion = new vscode.CompletionItem('new');
			commandCompletion.kind = vscode.CompletionItemKind.Keyword;
			commandCompletion.insertText = 'new ';
			commandCompletion.command = {
				command: 'editor.action.triggerSuggest',
				title: 'Re-trigger completions...'
			};
			// return all completion items as array 
			let newArray = [
				simpleCompletion,
				snippetCompletion,
				commitCharacterCompletion,
				commandCompletion
			];

			console.log(mainFunctions);

			return newArray.concat(mainFunctions, evalFunctions, statsFunctions);
		}
	});

	let differentSplunkProvider = vscode.languages.registerCompletionItemProvider(
		splunkSelector,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				//get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('console.')) {
					return undefined;
				}
				return [
					new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('error', vscode.CompletionItemKind.Method)
				];
			}
		},
		'.' // trigger whenever a '.' is being typed
	);

	context.subscriptions.push(disposable, differentSplunkProvider, splunkProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {}