const fs = require('fs');
const path = require('path');

function main() {
    const rootDir = path.dirname(process.argv[1]); // get this script folder

    const fnameSk = path.resolve(rootDir, './index--single.html');
    const cnt = fs.readFileSync(fnameSk);

    const b64 = cnt.toString('base64');

    const newCnt = `{ "skeleton": "${b64}" }`;
    const fnameDt = path.resolve(rootDir, './template-4-pmac.json'); // packed-html-for-pmac
    fs.writeFileSync(fnameDt, newCnt);

    const distFolder = path.resolve(rootDir, '../../dist/reports');
    fs.mkdirSync(distFolder, { recursive: true });
    const fnameDist = path.resolve(distFolder, './template-4-pmac.json'); // packed-html-for-pmac
    // console.log('rootDir', rootDir);
    // console.log('fnameDist', fnameDist);
    fs.writeFileSync(fnameDist, newCnt);

    // const a = atob(b64);
    // console.log('a', a);
}

main();
