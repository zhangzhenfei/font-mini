# 字体精简工具

一个优雅的桌面应用程序，用于字体子集化和精简，帮助网页设计师和开发者减小字体文件大小。

![应用截图](screenshot.png)

## 功能特点

- 支持多种字体格式（TTF、OTF、WOFF、WOFF2）
- 根据输入文本生成字体子集
- 支持转换为不同的输出格式
- 直观的用户界面
- 跨平台支持（Windows、macOS、Linux）
- 自动更新功能

## 安装

### 从发布版本安装

访问 [GitHub Releases](https://github.com/YOUR_USERNAME/font-mini-app/releases) 页面下载适合您操作系统的安装包。

### 从源代码构建

1. 克隆仓库
   ```bash
   git clone https://github.com/YOUR_USERNAME/font-mini-app.git
   cd font-mini-app
   ```

2. 安装依赖
   ```bash
   npm install
   ```

   > **注意**：如果安装依赖时遇到问题，可能是 Python 环境相关的问题。应用会自动尝试安装所需的 Python 依赖，或者您可以手动安装：
   > ```bash
   > pip install setuptools wheel
   > ```

3. 开发模式运行
   ```bash
   npm run dev
   ```

4. 构建应用
   ```bash
   npm run build  # 构建当前平台的应用
   ```

## 解决构建问题

如果在构建过程中遇到 `ttf2woff2` 相关错误，可以尝试以下解决方案：

1. 确保已安装 Python 3.x
2. 安装必要的 Python 依赖：
   ```bash
   pip install setuptools wheel
   ```
3. 如果问题仍然存在，可以编辑 `.npmrc` 文件（或创建一个）：
   ```
   npm_config_build_from_source=false
   npm_config_ignore_scripts=true
   ```

## 打包特定平台应用

您可以使用以下命令为特定平台构建应用：

```bash
# 构建Windows应用
npm run build:win

# 构建macOS应用
npm run build:mac

# 构建Linux应用
npm run build:linux

# 构建所有平台应用（需要注意跨平台构建的限制）
npm run build:all
```

**注意事项：**
- 在macOS上构建Windows和Linux应用通常没有问题
- 在Windows上构建macOS应用可能需要额外配置

## 使用方法

1. 启动应用程序
2. 点击"上传字体"按钮选择字体文件
3. 在文本框中输入需要保留的字符
4. 选择输出格式
5. 点击"精简字体"按钮
6. 处理完成后，点击"下载"按钮保存精简后的字体文件

## 发布到GitHub

### 交互式发布

本项目提供了简便的交互式发布工具，可以轻松发布应用到GitHub：

```bash
npm run release
```

发布工具会引导您完成整个发布流程：

1. 显示当前版本号，并让您选择发布类型（补丁、次要或主要版本）
2. 计算新版本号并请求您确认
3. 收集GitHub凭据（如果未通过环境变量设置）
4. 自动执行版本更新、应用构建和发布过程
5. 完成后提供发布结果和GitHub Releases链接

交互式发布过程中所有确认问题都默认为"是"，您可以直接按回车键继续。

#### 简化发布流程（环境变量配置）

您可以通过环境变量配置GitHub用户名和仓库名，这样发布时只需要输入令牌：

1. 复制示例环境变量文件:
   ```bash
   cp .env.example .env
   ```

2. 编辑`.env`文件，填写您的GitHub信息:
   ```
   GITHUB_OWNER=您的用户名
   GITHUB_REPO=font-mini-app
   ```

3. 发布时，系统会自动使用这些环境变量，只需要输入GitHub令牌

也可以直接在系统中设置环境变量:

**macOS/Linux**:
```bash
export GITHUB_OWNER="您的用户名"
export GITHUB_REPO="font-mini-app"
```

**Windows**:
```cmd
set GITHUB_OWNER=您的用户名
set GITHUB_REPO=font-mini-app
```

#### 前提条件

发布前，请确保：

1. 已在GitHub上创建仓库
2. 已创建GitHub个人访问令牌（PAT），具有`repo`权限
3. 所有代码更改已提交到Git（或使用自动提交功能）

#### 版本号管理

交互式发布工具会自动处理版本号更新：

* **补丁版本** (1.0.0 → 1.0.1): 用于错误修复和小改动
* **次要版本** (1.0.0 → 1.1.0): 用于新功能或非破坏性更改
* **主要版本** (1.0.0 → 2.0.0): 用于重大或破坏性更改

发布后，GitHub Actions会自动构建各平台安装包并发布到GitHub Releases。

## 技术栈

- Electron
- Vue 3
- Vite
- Fontmin
- Tailwind CSS

## 贡献

欢迎提交问题和拉取请求！

## 许可证

ISC