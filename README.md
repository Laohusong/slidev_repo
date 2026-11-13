# Slidev presentations

这个仓库保存多份独立的 Slidev 演示。当前论文汇报位于 [`presentations/2026_11_13/`](presentations/2026_11_13/)，源文件是 [`slides.md`](presentations/2026_11_13/slides.md)。它使用 **Slidev CLI 53.0.0** 和 **Frankfurt 主题 1.1.1**；版本记录在该目录的 `package.json` 和 `package-lock.json` 中。

## 安装并打开 `2026_11_13`

1. 安装 **Node.js 22.12.0 或更新版本**。安装后在终端检查：

   ```sh
   node --version
   npm --version
   ```

2. 在终端进入演示目录。以下命令从仓库根目录运行：

   ```sh
   cd presentations/2026_11_13
   npm ci
   npm run dev
   ```

`npm ci` 按锁文件安装该演示所需的 Slidev、主题和其他依赖，不需要全局安装 Slidev。`npm run dev` 会启动 Slidev 并尝试自动打开浏览器；如果没有自动打开，请访问终端显示的地址，通常是 `http://localhost:3030/`。终端需要保持运行；按 `Ctrl+C` 停止服务。

修改 `slides.md` 后，浏览器中的演示会自动更新。动画组件在 `components/`，图片在 `public/figures/`。

### 指定端口

如果 3030 端口已被占用，可以在演示目录运行：

```sh
npm run dev -- --port 3031
```

随后打开终端显示的新地址。

## 构建与导出

在 `presentations/2026_11_13/` 中运行：

```sh
npm run build   # 构建网页，输出到 dist/
npm run export  # 导出 PDF
```

导出前如缺少浏览器，可先运行 `npx playwright install chromium`。

## 其他目录

- `templates/basic/`：新演示模板。
- `tools/`：创建新演示的脚本。

每份演示都有自己的 `package.json` 和锁文件。运行某份演示时，先进入它的目录，再执行 `npm ci` 和 `npm run dev`。
