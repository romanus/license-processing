// node license-insert -src ./license.txt -to-path ./Assets/Scripts -exclude ".*\.meta"

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

    let license_path = null;
    let files_directory = null;
    let exclude = /^(?!.*)/; // regexp that matches nothing

    // get input data
    args.forEach(function (val, index, array) {
        switch(val){
            case '-src': license_path = args[index+1]; break;
            case '-to-path': files_directory = args[index+1]; break;
            case '-exclude': exclude = new RegExp(args[index+1]); break;
        }
    });

    // error checking
    if(license_path == null){
        console.error('Please enter license file path with -src flag');
        return;
    }
    if(files_directory == null){
        console.error('Please enter files directory with -to-path flag');
        return;
    }

    // get license text
    let license_text = null;
    try{
        license_text = await readFile(license_path);
    }catch(ex){
        console.log(ex);
        return;
    }

    // get all files from path
    const files_list = getAllFilesFromPath(files_directory);
    const filtered_files_list = files_list.filter(file_path => !file_path.matches(exclude));
    console.log(`Found ${filtered_files_list.length} files. Adding license...`);

    for(let file_path of filtered_files_list){
        let file_content = await readFile(file_path);
        await writeFile(file_path, license_text + file_content);
    }

    console.log('Done.');

})();