import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const name = process.argv[2]
if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error('用法：npm run new -- 2026-11-07-paper-reading（使用小写字母、数字和短横线）')
  process.exit(1)
}
const destination = path.join(root, 'presentations', name)
if (existsSync(destination)) {
  console.error('该演示已经存在，未修改任何文件。')
  process.exit(1)
}
cpSync(path.join(root, 'templates', 'basic'), destination, { recursive: true })
const packageFile = path.join(destination, 'package.json')
const pkg = JSON.parse(readFileSync(packageFile, 'utf8'))
pkg.name = name
writeFileSync(packageFile, JSON.stringify(pkg, null, 2) + '\n')
console.log(`已创建：${destination}\n进入目录后运行 npm install，再运行 npm run dev。`)
