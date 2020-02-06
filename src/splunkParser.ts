import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const commandInfoPath = "command_info";

export function returnCompletionItemfromJSON(context: vscode.ExtensionContext, fileName: string) {
    let completeFilePath = path.join(context.extensionPath, commandInfoPath, `${fileName}.json`);
    
    console.log(`file path: "${completeFilePath}"`);
    let file: string;
    file = fs.readFileSync(completeFilePath, 'utf-8');
    try {
        file = fs.readFileSync(completeFilePath, 'utf-8');
    } catch(e) {
        console.log("Error: ", e.stack);
    }

    const fileJson = JSON.parse(file);

    // iterate through json entry and output completion items
    const name = "Command_Name";
    const description = "Description";
    const syntax = "Supported functions and syntax";
    const related = "Related commands";
    const functionType = "Type of function";
    const params = "Parameters";
    const re = /\s/g;
    const completionArray = [];
    //const hoverArray = [];
    const hoverDict: any = {};
    
    for (const entry of fileJson) {
        const splunkCompletionItem = new vscode.CompletionItem(entry[name]);
        splunkCompletionItem.kind = vscode.CompletionItemKind.Keyword;
        splunkCompletionItem.commitCharacters = ['\t'];

        let hasSyntax: boolean = false;
        let hasParams: boolean = false;
        let hasType: boolean = false;
        let hasRelated: boolean = false;
        if (functionType in entry) { hasType = true; }
        if (syntax in entry) { hasSyntax = true; }
        if (related in entry) { hasRelated = true; }
        if (params in entry) {hasParams = true; }

        let detail: string = "";
        let documentation = entry[description];
        let docString: string = "";

         if ( hasParams ) {
            splunkCompletionItem.kind = vscode.CompletionItemKind.Class;
            const requiredParams = entry['Parameters']['Required'];
            const optionalParams = entry['Parameters']['Optional'];

            if (requiredParams) {
                docString = docString + "\n#### Required Arguments:";
                // Loop through params and create docstring
                for (const i in requiredParams) {
                    docString = docString + "\n_@param_ `" + i + "` -- " + requiredParams[i] + "\n";
                }
            }

            if (optionalParams) {
                docString = docString + "\n#### Optional Arguments: \n";
                // Loop through params and create docstring
                for (const i in optionalParams) {
                    docString = docString + "\n_@param_ `" + i + "` -- " + optionalParams[i] + "\n";
                }
            }
        }
        let hoverDocs;
        if ( hasRelated ) { documentation = new vscode.MarkdownString(documentation + docString + "\n##### Related Commands:\n" + entry[related]); hoverDocs = documentation + docString + "\n##### Related Commands:\n" + entry[related]; }
        if ( hasType ) { 
            detail = detail + '(' + entry[functionType].toLowerCase().replace(re, "_") + ') ';
            splunkCompletionItem.kind = vscode.CompletionItemKind.Method;
        }
        if ( hasSyntax ) { detail = detail + entry[syntax]; }
        else { detail = entry[name]; }
        
        if ( entry[functionType] === "Keyword" ) { splunkCompletionItem.kind = vscode.CompletionItemKind.Keyword; }

        //console.log(detail);
        //console.log(documentation);

        splunkCompletionItem.detail = detail;
        splunkCompletionItem.documentation = documentation;

        let splunkHoverItem = new vscode.Hover(entry[name]);
        splunkHoverItem.contents = [new vscode.MarkdownString(detail), documentation];
        completionArray.push(splunkCompletionItem);
        //hoverArray.push(splunkHoverItem);
        hoverDict[entry[name]] = splunkHoverItem;
    }
    return {
        "completion": completionArray,
        "hover": hoverDict
    };
}

export function returnCommandRegister(context: vscode.ExtensionContext) {
    const splunkCommandHandler = vscode.commands.registerCommand('splunk_search.Prettify', function() {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            console.log("editor is active");
            let document = editor.document;
            
            let docText: string = document.getText();
            let docTextCopy: string = docText;

            // define new vars:
            // keep track of position in string
            let i: number = 0; 

            // keep track of whether or not we're in a bracket
            let inBaseBracket: boolean = false;

            // keep track of what level we're at in brackets
            let bracketLevel = 0;
            for (const character of docTextCopy) {
                if (i === 0) { i++; continue; }
                if (inBaseBracket) {
                    if (character === '|') {
                        inBaseBracket = false;
                        i++;
                        continue;
                    }
                    else if (character === ' ') {
                        i++;
                        continue;
                    }
                    else {
                        inBaseBracket = false;
                        i++;
                        continue;
                    }
                }
                else if (character === "[") {
                    console.log("open bracket found");
                    let lengthToIncrease: number = 2;
                    let insertString: string = '\n';
                    
                    // insert string increases indent per bracketLevel
                    bracketLevel++;
                    for (var x = 0; x < bracketLevel; x++) { insertString = insertString + '  '; lengthToIncrease += 2; }
                    docText = docText.slice(0, i) + insertString + docText.slice(i);
                    inBaseBracket = true;
                    i += lengthToIncrease;
                }
                else if (character === "]") {
                    console.log("close bracket found");
                    let lengthToIncrease: number = 2;
                    let insertString: string = '\n';
                    
                    // make sure bracketLevel is decreased before adding in \t
                    bracketLevel--;
                    for (var x = 0; x < bracketLevel; x++) { insertString = insertString + '  '; lengthToIncrease += 2; }
                    docText = docText.slice(0, i + 1) + insertString + docText.slice(i + 1);
                    i += lengthToIncrease;
                }
                else if (character === '|') {
                    console.log("Pipe found");
                    console.log(docText[i-1]);
                    if (docText[i] === "\n" || docText[i - 1] === "\n" || docText[i - 2] === "\n") {
                        i++;
                        continue;
                    }
                    let lengthToIncrease: number = 2;
                    let insertString: string = '\n';
                    
                    // insert string increases indent per bracketLevel
                    for (var x = 0; x < bracketLevel; x++) { insertString = insertString + '  '; lengthToIncrease += 2; }
                    docText = docText.slice(0, i) + insertString + docText.slice(i);
                    i += lengthToIncrease;
                }
                else {
                    i++;
                }
            }
            console.log(docText);
            editor.edit(editBuilder => {
                let numLines: number = document.lineCount;
                console.log(numLines);
                let range: vscode.Range = new vscode.Range(0, 0, numLines, document.lineAt(numLines - 1).text.length);
                console.log(range);
                console.log(range.start, range.end);
                editBuilder.replace(range, docText);
                console.log("replaced");
            });
        }
    });

    return splunkCommandHandler;
}