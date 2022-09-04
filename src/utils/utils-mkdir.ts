import fs from 'fs';
import path from 'path'; // ts version of https://github.com/pillys/mkdir-p

export const mkdir = function (dist: string, callback: (err: NodeJS.ErrnoException | null) => void) {
    dist = path.resolve(dist);
    fs.exists(dist, function (exists) {
        if (!exists) {
            mkdir(path.dirname(dist), function () {
                fs.mkdir(dist, function (err) {
                    callback && callback(err);
                });
            });
        } else {
            callback && callback(null);
        }
    });
};

mkdir.sync = function (dist: string) {
    dist = path.resolve(dist);
    if (!fs.existsSync(dist)) {
        mkdir.sync(path.dirname(dist));
        fs.mkdirSync(dist);
    }
};
