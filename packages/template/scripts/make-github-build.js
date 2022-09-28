const fs = require('fs');
const path = require('path');

function main() {
    const rootDir = path.dirname(process.argv[1]); // get this script folder

    const fnameSkeleton = path.resolve(rootDir, '../dist/index--single.html'); // relative to this script folder
    const fnameJsonData = path.resolve(rootDir, '../src/utils/test-data-github.json'); // relative to this script folder

    if (!fs.existsSync(fnameSkeleton)) {
        console.log(`\nFirst create \n      ${fnameSkeleton} \n      by running 'yarn make-template' and then run this script.`);
        process.exit(1);
    }

    const cntJsonData = fs.readFileSync(fnameJsonData).toString();
    const cnt = fs.readFileSync(fnameSkeleton).toString();

    const newCnt = cnt.replace('"__INJECTED__DATA__"', cntJsonData);

    // save in dist
    const fnameDst = path.resolve(rootDir, '../dist-gh/index.html');
    fs.mkdirSync(path.dirname(fnameDst), { recursive: true });
    fs.writeFileSync(fnameDst, newCnt);
}

main();
