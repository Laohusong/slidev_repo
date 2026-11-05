# slidev_repo

个人 Slidev 汇报合集：一个仓库保存多份演示，每份演示是独立项目。

## 目录

```text
presentations/00-demo/   安装时的三页示例，含滑块交互
templates/basic/        新演示的起始模板
shared/                 共用组件和样式的预留目录
tools/                  新建演示的小工具
```

## 在当前电脑打开示例

双击根目录的 `Start-Demo.cmd`。它使用 `D:\app\Slidev\runtime` 中的 Node.js，在本机 3031 端口启动，避免与原安装示例的 3030 端口冲突。第一次启动会安装依赖；关闭启动窗口即可停止服务。

编辑 `presentations/00-demo/slides.md`，保存后浏览器自动更新。交互组件位于该演示的 `components/`，图片放在 `public/figures/`。

## 在其他电脑运行

先安装 Node.js 22.12 或更新版本，然后：

```sh
cd presentations/00-demo
npm ci
npm run dev
```

需要多个项目同时运行时，指定不同端口，例如 `npm run dev -- --port 3031`。

## 新建一份演示

在仓库根目录运行：

```sh
npm run new -- 2026-11-07-paper-reading
cd presentations/2026-11-07-paper-reading
npm install
npm run dev
```

新建后将该项目生成的 `package-lock.json` 一起提交，以固定依赖版本。

## 构建和导出

在某份演示目录中运行 `npm run build`，生成网页成品到该目录的 `dist/`。本地播放可能需要本机网页服务；联网资源不会因构建自动变成离线资源。

`npm run export` 用于导出；PDF 等导出还需要额外安装 Playwright/浏览器，当前仓库未预装这部分。

## 同步到 GitHub

修改后手动提交并推送：

```sh
git add .
git commit -m "Update presentation"
git push
```

当前采用手动同步，不会监控文件并自动上传。运行环境、依赖目录、构建成品、缓存、日志和环境变量文件已加入忽略列表。
