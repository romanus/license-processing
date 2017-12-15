/* 
 * See all commands:
 * node license.js -help
 */

const fs = require('fs');

String.prototype.matches = function(regexp) {
    return this.match(regexp) != null;
};
const readFile = (path, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    });

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) rej(err)
            else res()
        })
    });

const getAllFilesFromPath = function(dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
        filelist = getAllFilesFromPath(path.join(dir, file), filelist);
        }
        else {
        filelist.push((dir.startsWith('./') ? dir : './' + dir) + "/" + file);
        }
    });
    return filelist;
};

const insert = async (args) => {
    let license_path = null;
    let files_directory = null;
    let exclude = /^(?!.*)/; // regexp that matches nothing
    let matches = /.*/; // regexp that matches everyhing 

    // get input data
    args.forEach(function (val, index, array) {
        switch(val){
            case '-src': license_path = args[index+1]; break;
            case '-path': files_directory = args[index+1]; break;
            case '-exclude': exclude = new RegExp(args[index+1]); break;
            case '-matches': matches = new RegExp(args[index+1]); break;
        }
    });

    // error checking
    if(license_path == null){
        console.error('Please enter license file path with -src flag');
        return;
    }
    if(files_directory == null){
        console.error('Please enter files directory with -path flag');
        return;
    }

    // get license text
    const license_text = await readFile(license_path);

    // get all files from path
    const files_list = getAllFilesFromPath(files_directory);

    // filter files
    let filtered_files_list = files_list.filter(file_path => file_path.matches(matches));
    filtered_files_list = filtered_files_list.filter(file_path => !file_path.matches(exclude));

    console.log(`Adding licenses to ${filtered_files_list.length} files...`);

    for(let file_path of filtered_files_list){
        const file_content = await readFile(file_path);
        let new_file_content = license_text + "\n\n" + file_content;
        new_file_content = new_file_content.replace('\uFEFF', ''); // delete this annoying symbol
        await writeFile(file_path, new_file_content);
    }
};

const del = async (args) => {
    const license_regexp = /^\/\*(.|\n|\r)*?\*\/(\n|\r|\s)*/; // find first extended comment + all newlines (lazy)
    let files_directory = null;
    let exclude = /^(?!.*)/; // regexp that matches nothing
    let matches = /.*/; // regexp that matches everyhing 

    // get input data
    args.forEach(function (val, index, array) {
        switch(val){
            case '-path': files_directory = args[index+1]; break;
            case '-exclude': exclude = new RegExp(args[index+1]); break;
            case '-matches': matches = new RegExp(args[index+1]); break;
        }
    });

    // error checking
    if(files_directory == null){
        console.error('Please enter files directory with -path flag');
        return;
    }

    // get all files from path
    const files_list = getAllFilesFromPath(files_directory);

    // filter files
    let filtered_files_list = files_list.filter(file_path => file_path.matches(matches));
    filtered_files_list = filtered_files_list.filter(file_path => !file_path.matches(exclude));

    console.log(`Removing licenses from ${filtered_files_list.length} files...`);

    for(let file_path of filtered_files_list){
        let file_content = await readFile(file_path);
        const license_regexp_result = file_content.match(license_regexp);
        if(license_regexp_result == null || license_regexp_result.index != 0)
            continue;
        const cleaned_file = file_content.substring(license_regexp_result[0].length);
        await writeFile(file_path, cleaned_file);
    }
};

const replace = async (args) => {
    await del(args);
    await insert(args);
};

const help = () => {

    // WARNING: if copy commands from next string, mind escaped backslashes!
    console.log(`
    Prerequisites:
    It assumes that all licenses have pattern 
    /* license text 
     * in multiple rows 
     */

    Usage:

    Insert license to all .cs files in Assets folder except for GoogleVR folder content:
    node license.js -insert -src ./license.txt -path ./Assets -matches ".*\\.cs$" -exclude "GoogleVR/"

    Delete license from all files in Assets folder:
    node license.js -delete -path ./Assets

    Replace current license with new:
    node license.js -replace -src ./license.txt -path ./Assets -matches ".*\\.cs$" -exclude "GoogleVR/"
    `);
};

(async ()=>{
    'use strict';

    try{
        const argv = process.argv;

        if(argv.includes('-insert')){
            await insert(argv);
            console.log('Done.');
            return;
        }

        if(argv.includes('-delete')){
            await del(argv);
            console.log('Done.');
            return;
        }

        if(argv.includes('-replace')){
            await replace(argv);
            console.log('Done.');
            return;
        }

        if(argv.includes('-help')){
            help();
            return;
        }

        console.log(`command '${argv[2]}' not found`);
    }
    catch(ex){
        console.log(ex);
    }

})();