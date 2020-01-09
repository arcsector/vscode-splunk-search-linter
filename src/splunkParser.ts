import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const commandInfoPath = "command_info";

function returnCompletionItemfromJSON(fileName: string, filePath: string) {
    let completeFilePath = path.join(filePath, `${fileName}+".csv"`);
    console.log(`file path: "${completeFilePath}"`);
    let file: string;
    file = fs.readFileSync(completeFilePath, 'utf-8');
    try {
        file = fs.readFileSync(completeFilePath, 'utf-8');
    } catch(e) {
        console.log("Error: ", e.stack);
    }
    console.log(file);

    let fileJson = JSON.parse(file);
    console.log(fileJson);

    // iterate through json entry and output completion items
    const name = "Command_Name";
    const description = "Descrition";
    const syntax = "Supported functions and syntax";
    const related = "Related commands";
    const functionType = "Type of function";
    
    for (let entry of fileJson){
        const commitCharacterCompletion = new vscode.CompletionItem('console');
	    commitCharacterCompletion.commitCharacters = ['.'];
	    commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');
    }
    //return fileArray;
}

function returnDictFromCSV(fileName: string, filePath: string) {
    let completeFilePath = path.join(filePath, `${fileName}+".csv"`);
    console.log(`file path: "${completeFilePath}"`);
    let file;
    try {
        file = fs.readFileSync(completeFilePath, 'utf-8');
    } catch(e) {
        console.log("Error: ", e.stack);
    }
    console.log(file);

    let fileArray = file?.split("\n");
    console.log(fileArray);

    return fileArray;
}

//export const mainFunctions = returnListFromCSV('Command', commandInfoPath);
