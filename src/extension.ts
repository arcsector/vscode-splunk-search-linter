// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { returnCompletionItemfromJSON } from './splunkParser';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Define document selector
	let splunkSelector:vscode.DocumentSelector = {
		scheme: 'file',
		language: 'splunk'
	};
	let mainFunctions = returnCompletionItemfromJSON(context, 'Command_description_Related_table3');
	const mainHovers = mainFunctions['hover'];
	const mainCompletions = mainFunctions['completion'];
	let evalFunctions = returnCompletionItemfromJSON(context, 'eval_functions-syntax_description_type');
	const evalHovers = evalFunctions['hover'];
	const evalCompletions = evalFunctions['completion'];
	let statsFunctions = returnCompletionItemfromJSON(context, 'stats_functions-syntax_description_type');
	const statsHovers = statsFunctions['hover'];
	const statsCompletions = statsFunctions['completion'];
	let operators = returnCompletionItemfromJSON(context, 'operators-syntax_description_type');
	const operatorsHovers = operators['hover'];
	const operatorsCompletions = operators['completion'];
	const allHovers = {...mainHovers, ...evalHovers, ...statsHovers, ...operatorsHovers};

	// ====================== COMPLETION ITEMS ====================== //
	console.log("Start providing completion items");
	// Here we will start our Completion provider
	console.log("Providing base completion items");
	let splunkProvider = vscode.languages.registerCompletionItemProvider(splunkSelector, {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			return mainCompletions.concat(evalCompletions, statsCompletions, operatorsCompletions);
		}
	});

	console.log("Providing eval completion items");
	// Here we suggest new commands after eval functions
	let evalSplunkProvider = vscode.languages.registerCompletionItemProvider(
		splunkSelector,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				// matches: pipe followed by 0 or more space followed by "eval" 0 or more space
				// followed by 1 or more word-types followed by 0 or more space followed by "="
				// followed by 0 or more space
				let regexp = new RegExp('eval[\\s]+[\\w\\-\\_]+[\\s]*=[\\s]*');
				let linePrefix = document.lineAt(position).text.substr(0, position.character);

				console.log(linePrefix.match(regexp));
				if (!(linePrefix.match(regexp))) {
					return undefined;
				}
				return evalCompletions;
			}
		},
		' ', '='
	);

	console.log("Providing stats completion items");
	// Here we try and suggest new commands after stats functions
	let statsSplunkProvider = vscode.languages.registerCompletionItemProvider(
		splunkSelector,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let regexp = new RegExp('[a-z]*stats[\\s]+');
				let linePrefix = document.lineAt(position).text.substr(0, position.character);

				if (!linePrefix.match(regexp)) {
					return undefined;
				}
				return statsCompletions;
			}
		},
		' '
	);

	console.log("Providing main completion items");
	// Here we try and suggest new commands after pipe
	let pipeSplunkProvider = vscode.languages.registerCompletionItemProvider(
		splunkSelector,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let regexp = new RegExp('\\\\|[\\s]*');
				let linePrefix = document.lineAt(position).text.substr(0, position.character);

				if (!(linePrefix.endsWith('| ') || linePrefix.endsWith('|'))) {
					return undefined;
				}
				return mainCompletions;
			}
		},
		' ', '|'
	);

	console.log("Providing operator completion items");
	// Here we try and suggest operators after stats functions
	let operatorSplunkProvider = vscode.languages.registerCompletionItemProvider(
		splunkSelector,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let regexp = new RegExp('(avg\\s|count\\s|distinct_count\\s|estdc\\s|estdc_error\\s|max\\s|mean\\s|median\\s|min\\s|mode\\s|percentile\\s|range\\s|stdev\\s|stdevp\\s|sum\\s|sumsq\\s|var\\s|varp\\s|first\\s|last\\s|list\\s|values\\s|earliest\\s|earliest_time\\s|latest\\s|latest_time\\s|per_day\\s|per_hour\\s|per_minute\\s|per_second\\s|rate\\s)');
				let linePrefix = document.lineAt(position).text.substr(0, position.character);

				if (!(linePrefix.match(regexp))) {
					return undefined;
				}
				return operatorsCompletions;
			}
		},
		' '
	);
	// ====================== /COMPLETION ITEMS ====================== //

	console.log("Providing hover items");
	// ========================= HOVER ITEMS ========================= //
	let splunkHoverProvider = vscode.languages.registerHoverProvider(splunkSelector, {
		provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
			const splunkRange = document.getWordRangeAtPosition(position);
			const hoverWord = document.getText(splunkRange);
			
			if (!(hoverWord in allHovers)) {
				return undefined;
			}
			return allHovers[hoverWord];
		}
	});
	
	context.subscriptions.push(
		splunkProvider, 
		evalSplunkProvider, 
		statsSplunkProvider, 
		pipeSplunkProvider, 
		operatorSplunkProvider, 
		splunkHoverProvider
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}