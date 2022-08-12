import * as fs from 'fs'
import * as path from 'path'

interface IFileStruct {
  [typeName: string]: string[]
}

interface IOptions {
  path: string
  fileTypes: string[]
  ignore: string[]
}

class LineCounter {
  private path: string
  private fileTypes: string[]
  private ignore: string[]
  private dirstructure: IFileStruct
  /**
   *
   * @param path 待检测的目录
   * @param fileTypes 需要检测的文件类型
   * @param ignore 需要忽略的文件路径
   */
  constructor(options?: Partial<IOptions>) {
    options = Object.assign(defaultOptions, options)
    this.path = options.path!
    this.fileTypes = options.fileTypes!
    this.ignore = options.ignore!.map((item) =>
      path.join(path.resolve('./'), item),
    )
    this.dirstructure = LineCounter.getDirStruct(
      this.path,
      this.fileTypes,
      this.ignore,
    )
  }

  static isDir(path: string): boolean {
    return fs.lstatSync(path).isDirectory()
  }

  static getDirStruct(pathName: string, suffixes: string[], ignore: string[]) {
    let arr: string[] = [pathName]
    let files: IFileStruct = {}
    suffixes.forEach((item) => (files[item] = []))
    while (arr.length) {
      let curPath = arr.shift()!
      // 当前路径是一个文件夹时
      if (LineCounter.isDir(curPath)) {
        const curDirArr = fs.readdirSync(curPath)
        for (let i = 0; i < curDirArr.length; i++) {
          const newPath = path.join(curPath, curDirArr[i])
          if (ignore.indexOf(newPath) < 0) {
            arr.push(newPath)
          }
        }
      } else {
        // 如果当前路径为文件，则拆分文件名并统计格式
        const temp = curPath.split('.')
        const curSuffix = temp[temp.length - 1]
        const index = suffixes.indexOf(curSuffix)
        if (index > -1) {
          files[suffixes[index]].push(curPath)
        }
      }
    }
    return files
  }

  static staticFileLine(filePath: string) {
    try {
      return fs.readFileSync(filePath, 'utf-8').split('\n').length
    } catch (err) {
      throw new Error('count single File lines failed ' + JSON.stringify(err))
    }
  }

  public getLineStatistics() {
    const dir = this.dirstructure
    let fileTypes = Object.keys(dir)
    let total = 0
    let lineNums = {}
    for (let i = 0; i < fileTypes.length; i++) {
      const typeName = fileTypes[i]
      const someTypeFiles = dir[typeName]
      lineNums[typeName] = 0
      for (let j = 0; j < someTypeFiles.length; j++) {
        try {
          const _lines = LineCounter.staticFileLine(someTypeFiles[j])
          lineNums[typeName] += _lines
          total += _lines
        } catch (err) {}
      }
    }
    lineNums['total'] = total
    return lineNums
  }

  public getDirStruct() {
    return this.dirstructure
  }
}

const defaultOptions: IOptions = {
  path: path.resolve('./'),
  fileTypes: ['tsx', 'ts', 'js', 'css', 'scss', 'less'],
  ignore: ['node_modules', 'public', 'LineCount.js', 'LineCount.ts'],
}

const reader = new LineCounter()

console.log(reader.getDirStruct())
console.log(reader.getLineStatistics())
