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
    const completionArray = [];
    
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

        if ( hasRelated ) { documentation = new vscode.MarkdownString(documentation + docString + "\n##### Related Commands:\n" + entry[related]); }
        if ( hasType ) { 
            detail = detail + '(' + entry[functionType] + ') ';
            splunkCompletionItem.kind = vscode.CompletionItemKind.Method;
        }
        if ( hasSyntax ) { detail = detail + entry[syntax]; }
        else { detail = entry[name]; }
        
        //console.log(detail);
        //console.log(documentation);

        splunkCompletionItem.detail = detail;
        splunkCompletionItem.documentation = documentation;
        completionArray.push(splunkCompletionItem);
    }
    return completionArray;
}