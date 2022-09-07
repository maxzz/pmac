const fs = require('fs');
const path = require('path');

function main() {
    const rootDir = path.dirname(process.argv[1]); // get this script folder

    const fnameSk = path.resolve(rootDir, './index--single.html');
    const cnt = fs.readFileSync(fnameSk);

    const b64 = cnt.toString('base64');

    // a copy in working folder
    const newCnt = `{ "skeleton": "${b64}" }`;
    const fnameDt = path.resolve(rootDir, './template-4-pmac.json');
    fs.writeFileSync(fnameDt, newCnt);

    // copy into dist folder
    const distFolder = path.resolve(rootDir, '../../dist/report-template');
    fs.mkdirSync(distFolder, { recursive: true });

    const fnameDist = path.resolve(distFolder, './template-4-pmac.json');
    fs.writeFileSync(fnameDist, newCnt);
}

main();
