// extension.ts
import * as vscode from 'vscode'

// 当扩展被激活时被调用
// 扩展何时被激活：你第一次执行command命令时
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "devbox" is now active!')

  // 命令在package.json里声明，通过register的方式写入具体的逻辑
  const disposable = vscode.commands.registerCommand(
    'devbox.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from devbox!')
    }
  )

  // 注册给vscode上下文。此时即可用状态
  context.subscriptions.push(disposable)
}

// 当扩展失活时被调用
export function deactivate() {}
