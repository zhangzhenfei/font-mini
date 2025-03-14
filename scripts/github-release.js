const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 读取package.json获取当前版本
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

console.log(`\n========== 版本发布工具 ==========`);
console.log(`当前版本: ${currentVersion}`);
console.log('===================================\n');

// 增强型问题函数，支持默认值
function askQuestion(question, defaultValue = '') {
  return new Promise((resolve) => {
    // 如果有默认值，在问题中显示
    const displayQuestion = defaultValue 
      ? `${question} [${defaultValue}]: ` 
      : `${question}: `;
    
    rl.question(displayQuestion, (answer) => {
      // 如果用户直接按回车，使用默认值
      resolve(answer.trim() || defaultValue);
    });
  });
}

// 是否确认函数 (默认yes)
async function confirmAction(question) {
  const answer = await askQuestion(`${question} (Y/n)`, 'y');
  return answer.toLowerCase() === 'y';
}

// 检查Git工作目录
async function checkGitStatus() {
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim()) {
      console.log('\n⚠️ Git工作目录不干净，发现未提交的更改:');
      console.log(gitStatus);
      
      const shouldCommit = await confirmAction('\n是否要自动提交这些更改？');
      if (shouldCommit) {
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "自动提交：准备发布"', { stdio: 'inherit' });
        console.log('✅ 已提交所有更改');
        return true;
      } else {
        console.log('\n❌ 发布取消。请先提交或暂存您的更改，然后再尝试发布。');
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('\n❌ 检查Git状态时出错:', error.message);
    return false;
  }
}

// 选择发布类型
async function selectReleaseType() {
  console.log('\n请选择发布类型:');
  console.log('1: 补丁版本/patch (用于错误修复)');
  console.log('2: 次要版本/minor (用于新功能)');
  console.log('3: 主要版本/major (用于重大变更)');
  
  // 默认选择补丁版本
  const answer = await askQuestion('请选择 [1-3]', '1');
  
  let releaseType;
  switch (answer) {
    case '1':
      releaseType = 'patch';
      break;
    case '2':
      releaseType = 'minor';
      break;
    case '3':
      releaseType = 'major';
      break;
    default:
      console.log('无效的选择，使用默认值: patch');
      releaseType = 'patch';
  }
  
  // 计算新版本号
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  let newVersion;
  
  if (releaseType === 'patch') {
    newVersion = `${major}.${minor}.${patch + 1}`;
  } else if (releaseType === 'minor') {
    newVersion = `${major}.${minor + 1}.0`;
  } else {
    newVersion = `${major + 1}.0.0`;
  }
  
  return { releaseType, newVersion };
}

// 主程序
async function main() {
  try {
    // 检查Git状态
    const gitStatusOk = await checkGitStatus();
    if (!gitStatusOk) {
      rl.close();
      return;
    }
    
    // 选择版本
    const { releaseType, newVersion } = await selectReleaseType();
    
    // 确认版本更新
    console.log(`\n将版本从 ${currentVersion} 更新到 ${newVersion}`);
    const confirmVersion = await confirmAction('确认继续？');
    if (!confirmVersion) {
      console.log('发布已取消');
      rl.close();
      return;
    }
    
    // 执行版本更新和提交
    console.log('\n开始版本更新流程...');
    
    // 执行版本更新
    console.log(`\n执行: npm version ${releaseType}`);
    execSync(`npm version ${releaseType}`, { stdio: 'inherit' });
    
    // 推送到远程仓库
    const shouldPush = await confirmAction('\n是否要将新版本推送到远程仓库？');
    if (shouldPush) {
      console.log('\n执行: git push --follow-tags');
      execSync('git push --follow-tags', { stdio: 'inherit' });
      console.log(`\n✅ 版本 v${newVersion} 已更新并推送到远程仓库`);
    } else {
      console.log(`\n✅ 版本 v${newVersion} 已更新，但尚未推送到远程仓库`);
      console.log('您可以稍后使用 "git push --follow-tags" 命令手动推送');
    }
  } catch (error) {
    console.error('\n❌ 版本更新过程中出错:', error.message);
  } finally {
    rl.close();
  }
}

// 当命令行界面关闭时
rl.on('close', () => {
  console.log('\n谢谢使用，再见！');
  process.exit(0);
});

// 启动主程序
main(); 