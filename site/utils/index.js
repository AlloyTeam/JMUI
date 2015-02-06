var cheerio = require('cheerio');
var path    = require('path');
var fs      = require('fs');
var minify  = require('node-minify');
var Q       = require('q');
var rimraf  = require('rimraf');
var stripIndent = require('strip-indent');
var ncp     = require('ncp').ncp;
var zip     = require('zipfolder');
var concat  = require('concat');

function concatFiles (fileIn, fileOut) {
    var deferred = Q.defer();
    concat(fileIn, fileOut, function (err) {
        if (err) {
            deferred.reject(err);
            console.log(err)
        }
        deferred.resolve(fileOut);
    });
    return deferred.promise;
}

function minifyCss(fileIn, fileOut) {
    var deferred = Q.defer();
    new minify.minify({
        type: 'yui-css',
        fileIn: fileIn,
        fileOut: fileOut,
        tempPath: './tmp/',
        callback: function(err, min){
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(min);
        }
    });
    return deferred.promise;
}

function minifyJs(fileIn, fileOut) {
    var deferred = Q.defer();
    new minify.minify({
        type: 'yui-js',
        fileIn: fileIn,
        fileOut: fileOut,
        tempPath: './tmp/',
        callback: function(err, min){
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(min);
        }
    });
    return deferred.promise;
}

function copyFolder(source, destination) {
    var deferred = Q.defer();
    ncp(source, destination, function (err) {
        if (err) {
            deferred.reject(err);
        }
        deferred.resolve(destination);
    });
    return deferred.promise;
}

function zipFolder(folderPath) {
    var deferred = Q.defer();
    zip.zipFolder({folderPath: folderPath})
        .then(function (targetFolderPath) {
            deferred.resolve(targetFolderPath);
        }, function (err) {
            deferred.reject(err);
        });
    return deferred.promise;
}

function removeFolderAndZipFile (folderPath, timeout) {
    // remove folder
    rimraf(folderPath, function (error) {
        if (error) {
            return console.log(error);
        }
        console.log(folderPath, 'was removed.')
    });

    setTimeout(function () {
        //remove zip file
        var zipFilePath = folderPath + '.zip';
        fs.unlink(zipFilePath, function (error) {
            if (error) {
                return console.log(error);
            }
            console.log(zipFilePath, 'was removed.')
        });
    }, timeout);
}

exports.concatFiles = concatFiles;
exports.minifyCss = minifyCss;
exports.minifyJs = minifyJs;
exports.copyFolder = copyFolder;
exports.zipFolder = zipFolder;
exports.removeFolderAndZipFile = removeFolderAndZipFile;
