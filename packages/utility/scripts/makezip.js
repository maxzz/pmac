const fs = require('fs');
const JSZip = require('jszip');

function main() {
    console.log('pmac.exe zipping');

    try {
        const zip = new JSZip();

        try {
            const exe = fs.readFileSync('pmac.exe');
            zip.file("pmac.exe", exe);
        } catch (error) {
            throw new Error('Cannot read pmac.exe')    
        }
       
        zip.generateAsync({ type: "uint8array" }).then(function (content) {
            fs.writeFileSync('pmac.zip.txt', content);
        });

        console.log('Created pmac.zip.txt');
    } catch (error) {
        console.log(error.message);
        process.exit(-1);
    }
}

main();