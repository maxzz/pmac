const fs = require('fs');
const path = require('path');

function main() {
    const sriptDir = path.dirname(process.argv[1]);
    const fname = path.resolve(sriptDir, './index--single.html');

    const cnt = fs.readFileSync(fname);

    const b64 = cnt.toString('base64');
    console.log('b64', b64);

    // const b64 = btoa(cnt.toString());
    // console.log('b64', b64);

    const a = atob(b64);
    console.log('a', a);

    // const cnt = fs.readFileSync(fname).toString();
    // const b64 = Buffer.from(cnt, 'base64');
    // console.log('b64', b64.toString());
}

main();
