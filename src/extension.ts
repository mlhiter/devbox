import * as vscode from 'vscode'
import WebSocket from 'ws'
import axios from 'axios'

class RemoteFileSystemProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    if (element) {
      // 如果有子元素，获取子文件/文件夹
      return this.getFiles(element.resourceUri?.toString())
    } else {
      console.log('Getting root files')
      // 获取根目录文件/文件夹
      return this.getFiles('http://localhost:3000/directory')
    }
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element
  }

  async getFiles(url: string | undefined): Promise<vscode.TreeItem[]> {
    if (!url) {
      return []
    }
    try {
      const response = await axios.get(url)
      return response.data.files.map((file: any) => {
        const isDirectory = file.type === 'directory'
        const treeItem = new vscode.TreeItem(
          file.name,
          isDirectory
            ? vscode.TreeItemCollapsibleState.Collapsed
            : vscode.TreeItemCollapsibleState.None
        )
        treeItem.resourceUri = vscode.Uri.parse(
          `http://localhost:3000/file/${file.name}`
        )
        treeItem.command = {
          command: 'devbox.openFile', // 命令标识符
          title: 'Open File', // 命令标题
          arguments: [treeItem.resourceUri], // 命令参数，这里传递文件的 URI
        }
        treeItem.contextValue = 'file'
        console.log(treeItem)
        return treeItem
      })
    } catch (error) {
      console.error('Error fetching files:', error)
      return []
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "devbox" is now active!')

  const disposable = vscode.commands.registerCommand(
    'devbox.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from devbox!')
    }
  )

  const connectWebSocketTerminal = vscode.commands.registerCommand(
    'devbox.connectWebSocketTerminal',
    () => {
      const writeEmitter = new vscode.EventEmitter<string>()
      let currentInput = ''

      const pty = {
        onDidWrite: writeEmitter.event,
        open: () => {},
        close: () => {},
        handleInput: (data: string) => {
          console.log('Input:', data)
          if (data === '\r') {
            currentInput += '\r\n'
            console.log('Enter key detected')
            ws.send(currentInput)
            writeEmitter.fire('\r\n') // 移动到新的一行
            currentInput = ''
          } else if (data === '\b') {
            console.log('Backspace key detected')
            // 检测到退格键
            if (currentInput.length > 0) {
              currentInput = currentInput.slice(0, -1) // 删除最后一个字符
              // 为了在终端中删除字符，我们需要发送退格键，空格（以覆盖已删除的字符），然后再次退格
              writeEmitter.fire('\b \b')
            }
          } else {
            currentInput += data
            writeEmitter.fire(data) // 显示输入的字符
          }
        },
      }

      const terminal = vscode.window.createTerminal({
        name: 'WebSocket Terminal',
        pty,
      })
      terminal.show()

      const ws = new WebSocket('ws://localhost:3000')

      ws.onopen = function () {
        writeEmitter.fire('Connected to WebSocket Terminal.\r\n')
      }

      ws.onmessage = function (event) {
        const data = event.data.toString()
        console.log('Received:', data)
        writeEmitter.fire(data + '\r\n')
      }

      ws.onclose = function () {
        terminal.dispose()
      }
    }
  )

  const connectRemoteExplorer = vscode.commands.registerCommand(
    'devbox.connectRemoteExplorer',
    async () => {}
  )
  const openFile = vscode.commands.registerCommand(
    'devbox.openFile',
    async (resourceUri: vscode.Uri) => {
      if (resourceUri) {
        // 使用 axios 或其他 HTTP 客户端获取文件内容
        console.log(resourceUri.toString())
        const response = await axios.get(resourceUri.toString())
        const content = response.data.content // 假设直接获取到文件内容

        // 创建一个未保存的文档，显示文件内容
        const document = await vscode.workspace.openTextDocument({
          content, // 文件内容
          language: 'javascript', // 根据需要设置语言模式
        })
        await vscode.window.showTextDocument(document, { preview: false })
      }
    }
  )

  const remoteFileSystemProvider = new RemoteFileSystemProvider()
  vscode.window.createTreeView('remoteExplorer', {
    treeDataProvider: remoteFileSystemProvider,
  })

  context.subscriptions.push(
    disposable,
    connectWebSocketTerminal,
    connectRemoteExplorer,
    openFile
  )
}

// This method is called when your extension is deactivated
export function deactivate() {}
