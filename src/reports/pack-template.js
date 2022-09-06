const fs = require('fs');
const path = require('path');

function main() {
    const rootDir = path.dirname(process.argv[1]); // get this script folder

    const fnameSk = path.resolve(rootDir, './index--single.html');
    const cnt = fs.readFileSync(fnameSk);

    const b64 = cnt.toString('base64');

    const newCnt = `var packed64 = { "skeleton": "${b64}" };`;
    const fnameDt = path.resolve(rootDir, './template-4-pmac.js'); // packed-html-for-pmac
    fs.writeFileSync(fnameDt, newCnt);

    // const a = atob(b64);
    // console.log('a', a);
}

main();
