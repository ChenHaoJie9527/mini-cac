## CAC源码共读分析

### 1. CAC是什么？

`cac`构建命令行应用程序的简单而强大的框架

### 2.分析一下这个库的目录

#### 2.1 有哪些文件

```tex
cac
├─ .editorconfig
├─ .gitattributes
├─ .github
│    ├─ FUNDING.yml
│    └─ ISSUE_TEMPLATE.md
├─ .gitignore
├─ .prettierrc
├─ LICENSE
├─ README.md
├─ circle.yml
├─ examples
├─ index-compat.js
├─ jest.config.js
├─ mod.js
├─ mod.ts
├─ mod_test.ts
├─ package.json
├─ rollup.config.js
├─ scripts
│    └─ build-deno.ts
├─ src
│    ├─ CAC.ts
│    ├─ Command.ts
│    ├─ Option.ts
│    ├─ __test__
│    ├─ deno.ts
│    ├─ index.ts
│    ├─ node.ts
│    └─ utils.ts
├─ tsconfig.json
└─ yarn.lock
```

- `editorconfig`

  米老鼠，主要是用于同一个项目在不同的编辑器和IDE下维护一致的编码风格，主要有两部分组成，定义编码样式的文件格式和遵循已经定义的样式规范。有助于代码风格和样式规范保持一致性。比如在项目中配置的 `Eslint` 和 `Preeter`，但是每个人的编辑器和IDE安装插件配置不一样，这就导致在实际开发过程中的代码风格和样式规范不一致。可通过 VSCdoe 插件市场里安装 editorconfig插件，该插件会读取项目里的 editorconfig 文件，并会执行里面的配置文件。

  [官网](https://editorconfig.org/)

  ### Example file 

  下面是为JS文件设置行尾和缩进样式的 edorconfig 文件

  ```tex
  # EditorConfig is awesome: https://EditorConfig.org
  # top-most EditorConfig file
  # root = true 表示 权限最高级 最顶层配置
  root = true
  
  # Unix-style newlines with a newline ending every file Unix 风格的换行符，每个文件都以换行符结束
  [*]
  end_of_line = lf
  insert_final_newline = true
  
  # Matches multiple files with brace expansion notation 使用大括号展开符号匹配多个文件
  # Set default charset 设置默认字符集
  [*.{js}]
  charset = utf-8
  
  # 4 space indentation 空格符号和首行缩进
  [*.js]
  indent_style = space
  indent_size = 4
  
  # Tab indentation (no size specified) Tab 缩进
  [Makefile]
  indent_style = tab
  
  # Indentation override for all JS under lib directory 对 lib 目录下的所有 JS 进行缩进重写
  [lib/**.js]
  indent_style = space
  indent_size = 2
  
  # Matches the exact files either package.json or .travis.yml 对匹配文件进行首位缩进
  [{package.json,.travis.yml}]
  indent_style = space
  indent_size = 2
  ```

  常用的配置如下：

  ```text
  root = true
  
  # 大括号通配符 表示适配任何文件
  [*]
  indent_style = space
  indent_size = 2
  end_of_line = lf
  charset = utf-8
  trim_trailing_whitespace = true
  insert_final_newline = true
  
  [*.md]
  trim_trailing_whitespace = false
  ```

  