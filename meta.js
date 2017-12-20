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

(async ()=>{
    'use strict';

    try{
        let matches = /.*\.meta$/;

        const files_list = getAllFilesFromPath("./");
        let filtered_files_list = files_list.filter(file_path => file_path.matches(matches));
        for(let file_path of filtered_files_list){
            const file_content = await readFile(file_path);
            let new_file_content = file_content.replace("licenseType: Free", "licenseType: Pro");
            await writeFile(file_path, new_file_content);
        }
    }
    catch(ex){
        console.log(ex);
    }

})();