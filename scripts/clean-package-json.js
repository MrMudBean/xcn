import {
  pathJoin,
  readFileToJsonSync,
  getDirectoryBy,
  writeJsonFileSync,
} from 'a-node-tools';

// 原始 package.json 内容
let packageJson = readFileToJsonSync('./package.json');
const dependencies = packageJson.dependencies;
// 移除冗余的键
[
  'scripts',
  'devDependencies',
  'lint-staged',
  'private',
  'dependencies',
].forEach(key => delete packageJson[key]);
const esPrefix = 'es'; // es 前缀
const cjsPrefix = 'cjs'; // cjs 前缀
const dtsPrefix = 'es/src'; // 类型文件的前缀
// 查看当前打包 dist 文件路径
const distParentPath = getDirectoryBy('dist', 'directory');

packageJson = {
  ...packageJson,
  main: cjsPrefix + '/index.js', // 旧版本 CommonJs 入口
  module: esPrefix + '/index.js', // 旧版本 ESM 入口
  types: dtsPrefix + '/index.d.ts', // 旧版本类型入口
  author: {
    name: '泥豆君',
    email: 'Mr.MudBean@outlook.com',
    url: 'https://earthnut.dev',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  description: '一个用于字符串拼接的小工具，多用于 class name 的拼接',
  sideEffects: false, // 核心：开启 Tree Shaking
  license: 'MIT',
  files: [cjsPrefix, esPrefix, 'LICENSE', 'README.md'],
  exports: {
    '.': {
      import: `./${esPrefix}/index.js`,
      default: `./${esPrefix}/index.js`,
      require: `./${cjsPrefix}/index.js`,
      types: `./${dtsPrefix}/index.d.ts`,
    },
  },
  keywords: ['xcn', '混合 className', '拼接字符串'],
  homepage: 'https://earthnut.dev/npm/xcn',
  dependencies,
  bugs: {
    url: 'https://github.com/MrMudBean/xcn/issues',
    email: 'Mr.MudBean@outlook.com',
  },
  repository: {
    type: 'git',
    url: 'git+https://github.com/MrMudBean/xcn.git',
  },
  browserslist: ['last 2 versions not ie <= 11'],
  // engines: {
  //   node: '>=18.0.0',
  // },
};

{
  // 整理打包后 package.json 文件路径
  const distPackagePath = pathJoin(distParentPath, './dist/package.json');
  // 写入新的 packages.json 文件
  writeJsonFileSync(distPackagePath, packageJson);
}
