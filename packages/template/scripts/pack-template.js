const fs = require('fs');
const path = require('path');

function main() {
    const rootDir = path.dirname(process.argv[1]); // get this script folder

    const fnameSkeleton = path.resolve(rootDir, '../dist/index.html'); // relative to this script folder
    
    if (!fs.existsSync(fnameSkeleton)) {
        console.log(`\nFirst create \n      ${fnameSkeleton} \n      by running 'yarn make-template' and then run this script.`);
        process.exit(1);
    }

    const cnt = fs.readFileSync(fnameSkeleton);

    const b64 = cnt.toString('base64');
    const newCnt = `{ "skeleton": "${b64}" }`;

    // save in dist
    const fnameDst = path.resolve(rootDir, '../dist/template-4-pmac.json');
    fs.mkdirSync(path.dirname(fnameDst), { recursive: true });
    fs.writeFileSync(fnameDst, newCnt);
}

main();
