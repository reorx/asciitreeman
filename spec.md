我想做一个纯前端的 ascii file tree editor. 例如，我通过 tree 命令得到如下目录结构:

```
.
├── backend
│   ├── bruno
│   ├── common_tools -> ../collectors/common_tools/dist/0.2.0
│   ├── local_scripts
│   ├── media
│   ├── neocm
│   ├── scripts
│   ├── static
│   ├── venv
│   ├── backend.env
│   ├── curlapi.sh
│   ├── db.sqlite3
│   ├── deploy_backend.sh
│   ├── docker-entrypoint.sh
│   ├── Dockerfile
│   ├── gen_frontend_queries.sh
│   ├── gen_frontend_types.sh
│   ├── gunicorn.conf.py
│   ├── LICENSE
│   ├── manage.py
│   ├── pgpy.ipynb
│   ├── README.md
│   ├── requirements.txt
│   ├── try_gcm.py
│   └── uwsgi.ini
├── collectors
│   ├── common
│   ├── common_tools
│   ├── domain_shodan
│   ├── ip_shodan
│   ├── portscan
│   ├── portscan_censys
│   ├── sample_workflow
│   ├── build_all.sh
│   ├── build_and_pack_collector.sh
│   ├── build_sample_workflow.sh
│   ├── getplatform.go
│   └── readme.md
├── frontend
│   ├── app
│   ├── build
│   ├── node_modules
│   ├── public
│   ├── deploy_frontend.sh
│   ├── Dockerfile
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
├── compose.prod.yml
├── compose.yml
├── pack_repo.sh
└── readme.md
```

我想通过这个工具将其修改变成这样:

```
.
├── backend
│   ├── myproject
│   ├── static
│   ├── gen_frontend_queries.sh
│   ├── gen_frontend_types.sh
│   └── manage.py
├── frontend
│   ├── app
│   ├── node_modules
│   ├── public
│   ├── Dockerfile
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
└── readme.md
```


我预计的交互方式如下：
- 打开 app 后，看到 app 的布局是最上方一个工具栏，下方是左右分栏的两个 panel
- 工具栏有按钮「load output」，点击后弹出 dialog，显示一个大输入框，用户将 tree command 的 output 粘贴进去，然后点击下放的 load 按钮
- 此时 dialog 关闭，主界面左侧分栏显示一个树形组件，通过解析后数据展示目录结构，具备以下交互功能：
  - 点击目录条目，将打开或关闭目录下的文件列表
  - 鼠标 hover 一个条目，在最右侧显示有 x 按钮，点击删除条目. 如果删除的是目录条目，则包括目录下的文件全都删除
  - 鼠标 hover 一个条目，在最右侧显示有 + 按钮，点击在当前条目同层级下方创建一个新条目，其名称通过弹出的 dialog 输入
  - 鼠标 hover 一个条目，在最右侧显示有 ⊕ 按钮，点击在当前条目的内层创建一个新条目，其名称通过弹出的 dialog 输入
  - 鼠标 hover 一个条目，在最右侧显示有 ^ 和 v 按钮，点击将当前条目在同层级进行上下移动
  - 鼠标 hover 一个条目，在最右侧显示有 r 按钮，点击弹出 dialog 对条目进行重命名
- 对左侧分栏的树形组件进行操作后，右侧分栏根据修改后的目录结构，立刻显示与 tree output 同等样式的 ascii text, 放在一个 textarea 中，允许任意修改，下方提供一个 Copy 按钮，点击复制内容到剪贴板


## 技术要求

- 在目录下写入 .nvmrc, 内容是 v24，表示用 nodejs v24 版本
- 使用 pnpm 管理包
- 使用 vite 构建
- TypeScript + React 实现 UI
- 树形组件自己实现，不依赖第三方库
