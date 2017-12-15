// node license-delete -from-path ./Assets/Scripts -exclude ".*\.meta"

// WARNING: Works only if license itself doesn't contain blocks like "/* some  text... */". It determines the license!

const fs = require('fs');

const args = process.argv;

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


(async ()=>{
    'use strict';

    const license_regexp = /^\/\*(.|\n|\r)*?\*\/(\n|\r)*/;
    let files_directory = null;
    let exclude = /^(?!.*)/; // regexp that matches nothing

    // get input data
    args.forEach(function (val, index, array) {
        switch(val){
            case '-from-path': files_directory = args[index+1]; break;
            case '-exclude': exclude = new RegExp(args[index+1]); break;
        }
    });

    // error checking
    if(files_directory == null){
        console.error('Please enter files directory with -from-path flag');
        return;
    }

    // get all files from path
    const files_list = getAllFilesFromPath(files_directory);
    const filtered_files_list = files_list.filter(file_path => !file_path.matches(exclude));
    console.log(`Found ${filtered_files_list.length} files. Removing licenses...`);

    for(let file_path of filtered_files_list){
        let file_content = await readFile(file_path);
        const license_regexp_result = file_content.match(license_regexp);
        if(license_regexp_result == null || license_regexp_result.index != 0)
            continue;
        const cleaned_file = file_content.substring(license_regexp_result[0].length);
        await writeFile(file_path, cleaned_file);
    }

    console.log('Done.');

})();