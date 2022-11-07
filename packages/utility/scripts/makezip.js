const fs = require('fs');
const JSZip = require('jszip');

//console.log('start', JSZip);
console.log('start');

const zip = new JSZip();

zip.file("Hello.txt", "Hello World\n");

// const img = zip.folder("images");
// img.file("smile.gif", imgData, {base64: true});

zip.generateAsync({ type: "uint8array" }).then(function (content) {
    console.log('33', content);
    fs.writeFileSync('pmac-zip.zip', content);
    // see FileSaver.js
    //saveAs(content, "example.zip");
});

/*
Results in a zip containing
Hello.txt
images/
    smile.gif
*/