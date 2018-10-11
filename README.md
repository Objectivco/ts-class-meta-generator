# Typescript Class Meta Info Generator (Webpack)

Ever needed to create classes on the fly with a string but can't justify mapping all your classes to strings? Say no more.

This plugin will analyze a provide path for typescript files and associate their class name with their implementation on a provided project level object.
This will allow for you to access class implementations without having to worry about generating the connections.

Webpack Usage
=============

```
let TsClassMetaGeneratorPlugin = require('ts-class-meta-generator');

{
	'plugins': [
		new TsClassMetaGeneratorPlugin({
			siteName: 'Site',
			ignoreFolders: ["Interfaces"]
		})
	]
}
```

Webpack Options
===============
```
srcFolder: string - The directory with ts source files you want walked
[Default]: ./src/ts

siteName: string - The class name / namespace you want to use for your container name
[Default]: Site

siteMetaFileName: string - The file name that holds all the meta information about the classes.
[Default]: site-meta.ts

siteMetaPath: string - The location the meta file should be generated.
[Default]: .

importPath: string - If siteMetaPath is not the root sometimes the import path needs to change
[Default]: ''

ignoreFiles: string[] - List of file names (case-sensitive) without the ts extension.
[Default]: []

ignoreFolders: string[] - List of folder names (case-sensitive) to ignore.
[Default]: []
```