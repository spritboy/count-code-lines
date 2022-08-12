# count-code-lines

A script that counts lines of code for a project



## How to use

The script depends on fs and path, so it must run in node environment but just node environment.



And it has some default options, like this:

```ts
const defaultOptions: IOptions = {
  path: path.resolve('./'),
  fileTypes: ['tsx', 'ts', 'js', 'css', 'scss', 'less'],
  ignore: ['node_modules', 'public', 'LineCount.js', 'LineCount.ts'],
}
```

args:

- path: The root of your project

- fileTypes: Which types of file you want to static

- ignore: Which directory and file you want to ignore, this field supports passing in relative paths

You can pass some customize options to cover the default options.



For example:

```ts
// LineCounter will use the default options
const reader = new LineCounter()

console.log(reader.getDirStruct())
console.log(reader.getLineStatistics())
```

Then it will show the structure of your project (exclude the directory that included in ignore)



Enjoy it !


