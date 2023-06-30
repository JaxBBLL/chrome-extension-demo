# chrome extension

vite + vue3 + @crxjs/vite-plugin 搭建的开发 chrome extension 项目模板

## 使用@crxjs/vite-plugin

@crxjs/vite-plugin 是一个专门为 Vite 构建 Chrome 扩展而设计的插件。它提供了一些功能和优化，以便更好地支持 Chrome 扩展的开发和构建。

@crxjs/vite-plugin 的主要功能包括：

1. 自动注入背景页脚本和内容脚本：可以自动将背景页脚本和内容脚本注入到扩展的 HTML 页面中，无需手动添加脚本标签。

2. 自动监听扩展文件变化：在开发过程中，当您修改扩展文件时，@crxjs/vite-plugin 会自动重新构建扩展，并将更改的文件推送到浏览器进行实时重载。

3. 优化打包：@crxjs/vite-plugin 会自动优化您的扩展包，删除不必要的文件和代码，以减小最终的扩展大小。

4. 支持在 Vite 中使用 Chrome 扩展 API：@crxjs/vite-plugin 会将 Chrome 扩展 API 注入到您的代码中，以便您可以在 Vite 中使用这些 API 进行开发。
