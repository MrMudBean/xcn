// 因为先执行的 `npm run b` 进行 rollup 打包，所以 `dist` 一定存在
import {
  pathJoin,
  readFileToJsonSync,
  getDirectoryBy,
  writeJsonFileSync,
} from 'a-node-tools';

let packageJson = readFileToJsonSync('./dist/package.json');

packageJson.name = 'mix-cn';

{
  const distPath = getDirectoryBy('dist', 'directory');

  const distPackagePath = pathJoin(distPath, './dist/package.json');

  writeJsonFileSync(distPackagePath, packageJson);
}
