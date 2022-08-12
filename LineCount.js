"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var LineCounter = /** @class */ (function () {
    /**
     *
     * @param path 待检测的目录
     * @param fileTypes 需要检测的文件类型
     * @param ignore 需要忽略的文件路径
     */
    function LineCounter(options) {
        options = Object.assign(defaultOptions, options);
        this.path = options.path;
        this.fileTypes = options.fileTypes;
        this.ignore = options.ignore.map(function (item) {
            return path.join(path.resolve('./'), item);
        });
        this.dirstructure = LineCounter.getDirStruct(this.path, this.fileTypes, this.ignore);
    }
    LineCounter.isDir = function (path) {
        return fs.lstatSync(path).isDirectory();
    };
    LineCounter.getDirStruct = function (pathName, suffixes, ignore) {
        var arr = [pathName];
        var files = {};
        suffixes.forEach(function (item) { return (files[item] = []); });
        while (arr.length) {
            var curPath = arr.shift();
            // 当前路径是一个文件夹时
            if (LineCounter.isDir(curPath)) {
                var curDirArr = fs.readdirSync(curPath);
                for (var i = 0; i < curDirArr.length; i++) {
                    var newPath = path.join(curPath, curDirArr[i]);
                    if (ignore.indexOf(newPath) < 0) {
                        arr.push(newPath);
                    }
                }
            }
            else {
                // 如果当前路径为文件，则拆分文件名并统计格式
                var temp = curPath.split('.');
                var curSuffix = temp[temp.length - 1];
                var index = suffixes.indexOf(curSuffix);
                if (index > -1) {
                    files[suffixes[index]].push(curPath);
                }
            }
        }
        return files;
    };
    LineCounter.staticFileLine = function (filePath) {
        try {
            return fs.readFileSync(filePath, 'utf-8').split('\n').length;
        }
        catch (err) {
            throw new Error('count single File lines failed ' + JSON.stringify(err));
        }
    };
    LineCounter.prototype.getLineStatistics = function () {
        var dir = this.dirstructure;
        var fileTypes = Object.keys(dir);
        var total = 0;
        var lineNums = {};
        for (var i = 0; i < fileTypes.length; i++) {
            var typeName = fileTypes[i];
            var someTypeFiles = dir[typeName];
            lineNums[typeName] = 0;
            for (var j = 0; j < someTypeFiles.length; j++) {
                try {
                    var _lines = LineCounter.staticFileLine(someTypeFiles[j]);
                    lineNums[typeName] += _lines;
                    total += _lines;
                }
                catch (err) { }
            }
        }
        lineNums['total'] = total;
        return lineNums;
    };
    LineCounter.prototype.getDirStruct = function () {
        return this.dirstructure;
    };
    return LineCounter;
}());
var defaultOptions = {
    path: path.resolve('./'),
    fileTypes: ['tsx', 'ts', 'js', 'css', 'scss', 'less'],
    ignore: ['node_modules', 'public', 'LineCount.js', 'LineCount.ts']
};
var reader = new LineCounter();
console.log(reader.getDirStruct());
console.log(reader.getLineStatistics());
