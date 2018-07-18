// const fs = require('fs');
// class CookieStore {
//     constructor(cookiesFileName) {
//         this.cookies = null;
//         this.cookiesFileName = cookiesFileName || 'cookies';
//     }
//     loadCookies(cookies) {
//         this.cookies = cookies;
//     }
//     saveCookies() {
//         if (!this.cookies) {
//             return fs.write(this.cookiesFileName, JSON.stringify(this.cookies), "w");
//         }
//     }
//     previousCookiesExist() {
//         return fs.stat(this.cookiesFileName, (err, stats) => {
//             return !err && true
//         });
//     }
//     readCookies() {
//         if (previousCookiesExist()) {
//             this.cookies = JSON.parse(fs.read(this.cookiesFileName))
//         }
//     }
//     removeCookies() {
//         fs.remove(this.cookiesFileName);
//     }
// }

// module.exports = new CookieStore();


var DCookieManagement = function (cookiesFileName) {
    this.fileManagement = require('fs');
    this.phantomCookies = null; //Original cookies from PhantomJS
    this.cookiesFileName = cookiesFileName; //set cookies file name

    DCookieManagement.prototype.loadCookies = function (cookies) {
        this.phantomCookies = cookies;
    };

    DCookieManagement.prototype.saveCookies = function () {
        console.log(this.cookiesFileName);
        if (this.phantomCookies != null)
            this.fileManagement.writeFileSync(this.cookiesFileName, JSON.stringify(this.phantomCookies));
    };
    DCookieManagement.prototype.readCookies = function () {
        if (this.cookieFileExists())
            this.loadCookies(JSON.parse(this.fileManagement.readFileSync(this.cookiesFileName)));
    };

    DCookieManagement.prototype.cookieFileExists = function () {
        // return new Promise(function (resolve, reject) {
        //     this.fileManagement.access(this.cookiesFileName, fs.F_OK, function (error) {
        //         resolve(!error);
        //     });
        // });
        return this.fileManagement.existsSync(this.cookiesFileName);
        // this.fileManagement.stat(this.cookiesFileName, await new Promise((err, stats) => {
        //     if (err) reject(err);
        //     else resolve();
        // }));
    };
    DCookieManagement.prototype.getCookies = function () {
        return this.phantomCookies;
    };

    DCookieManagement.prototype.removePreviousCookies = function () {
        this.fileManagement.remove(this.cookiesFileName);
    };

};

exports.create = function (cookiesFileName) {
    return new DCookieManagement(cookiesFileName);
};