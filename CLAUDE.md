Project spec: @spec.md

Please remember:
- ⚠️ NEVER EVER run `pnpm dev` or `npm run dev` directly, let the user run it by himself - THIS IS ABSOLUTELY FORBIDDEN
- ⚠️ NEVER start development server with `npm run dev &` or any background process
- ⚠️ USER HAS SAID THIS A MILLION TIMES - DO NOT RUN DEV SERVER EVER
- make sure to use the correct way to use tailwindcss v4

## TODO

- [x] 为本应用写一个简要的使用说明，包含中文和英文两种语言。写出来的内容放在一个TypeScript文件中，使其可以被组件所引用. 使用说明需简明扼要。首先交代我们的应用的用途。它是用来修改tree命令输出的文件目录结构。它的操作方式是这样的。在右侧的输入框中粘贴tree的输出。然后点击parse按钮。左侧将会展示解析后的可操纵的文件树。在这个文件树上可以对每一个条目进行改名、删除、上下移动、创建同级项、创建子项这一些操作。在这个目录树组件的顶部显示的是根目录的文件名称,可以修改。点击右侧的按钮可以展开或者缩进全部的目录。对目录树组件的修改会实时反映到右侧的文本输出中. 快捷键需要单独列一个heading来描写。目前支持当点击一个条目时，它会进入选中状态，此时按J、K或者上下按键即可对其进行向上移动和向下移动的操作
- [x] 在顶层栏右边增加一个help按钮，点击后打开一个dialog，其中展示我们的这个应用的简要的帮助说明, 点击按钮切换中英文两种语言
- [x] 修改index.html使用Open Graph的标准，使我们的网站在一些软件如Telegram或者Slack下面能够展示比较美观的链接预览。og:image 使用 @public/cover.png 
