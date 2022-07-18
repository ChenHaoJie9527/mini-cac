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

- `gitattributes`

  当执行 git 动作时，.`gitattributes` 文件允许你指定由 git 使用的文件和路径的属性，例如：`git commit` 等。换句话说，每当有文件保存或者创建时，git 会根据指定的属性来自动保存。

  为什么要使用 `.gitattributes`，这是因为在多人开发团队中，无法确定每个人的操作系统、编辑器、IDE等都是一致的。不同的操作系统，默认的文件结尾行就会不同。

  当我们在 .`gitattributes` 设置了属性 

  ```json
  {
    "endOfLine": "lf"
  }
  ```

  那么在 win上，会看到如下警告

  ![img](https://pic1.zhimg.com/80/v2-7f7615000240d6862bf8875328bbde70_720w.jpg)

  这时候 .`gitattributes` 就排上用场了

  在根目录上创建名为 `.gitattributes` 文件的示例

  ```tex
  *.js    eol=lf
  *.jsx   eol=lf
  *.json  eol=lf
  ```

  这时候 任何 .js  .jsx .json相关的文件都会生效，当将文件推送到远程仓库后。当有人从仓库中拉取代码后，创建以及修改文件时，git 都会自动的设置好正确的文件结尾。

  虽然 Git 通常不使用文件内容，但是可以将其配置为在存储库中将行结尾标准化为 LF，并且可以选择在签出文件时将其转换为 `CRLF`。

  如果您只是想在工作目录中使用 `CRLF` 行结尾，而不考虑使用的存储库，那么可以设置配置变量“ core.autocrlf”，而不使用任何属性。

  ```
  [core]
  	autocrlf = true
  ```

  如果您希望确保任何贡献者引入到存储库中的文本文件的行尾都是规范化的，那么您可以将所有文件的 text 属性设置为“ auto”。

  ```
  * text=auto
  ```

  **增加到已有的 Git 仓库**

  正如上面提到的，在仓库的根目录下创建名为 `.gitattributes` 的文件。一旦文件推送到 git 服务器后，请确保你的本地 仓库是干净的、无需提交的。使用命令 `git status` 可以检查是否你的仓库是干净的。

  **重置 GitAttributes**

  ```
  git rm --cached -r
  git reset --hard
  ```

  上面的命令就会根据文件 `.gitattributes` 中的定义，更新文件的结尾行。任何变更都会自动使用指定文件的文件结尾行格式。下一步，可以通知团队成员或者协作者去执行 Git 属性重置的命令。现在，prettier 就不会在提示有关 CR 的问题了，所有的开发者都可以安心写代码了!