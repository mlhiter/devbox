import path from 'path'
import * as os from 'os'
import * as vscode from 'vscode'

import { Disposable } from '../common/dispose'
import { parseSSHConfig } from '../api'
import { DevboxListItem } from '../types/devbox'

export class TreeView extends Disposable {
  constructor(context: vscode.ExtensionContext) {
    super()
    if (context.extension.extensionKind === vscode.ExtensionKind.UI) {
      const projectTreeDataProvider = new MyTreeDataProvider('devboxDashboard')
      const feedbackTreeDataProvider = new MyTreeDataProvider('devboxFeedback')
      // views
      this._register(
        vscode.window.createTreeView('devboxDashboard', {
          treeDataProvider: projectTreeDataProvider,
        })
      )
      this._register(
        vscode.window.createTreeView('devboxFeedback', {
          treeDataProvider: feedbackTreeDataProvider,
        })
      )
      // commands
      this._register(
        vscode.commands.registerCommand('devboxDashboard.refresh', () => {
          projectTreeDataProvider.refresh()
        })
      )
      this._register(
        vscode.commands.registerCommand(
          'devboxDashboard.createDevbox',
          (item: MyTreeItem) => {
            projectTreeDataProvider.create(item)
          }
        )
      )
      this._register(
        vscode.commands.registerCommand(
          'devboxDashboard.openDevbox',
          (item: MyTreeItem) => {
            projectTreeDataProvider.open(item)
          }
        )
      )
      this._register(
        vscode.commands.registerCommand(
          'devboxDashboard.deleteDevbox',
          (item: MyTreeItem) => {
            projectTreeDataProvider.delete(item)
          }
        )
      )
    }
  }
}

class MyTreeDataProvider implements vscode.TreeDataProvider<MyTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<MyTreeItem | undefined> =
    new vscode.EventEmitter<MyTreeItem | undefined>()
  readonly onDidChangeTreeData: vscode.Event<MyTreeItem | undefined> =
    this._onDidChangeTreeData.event
  private treeData: DevboxListItem[] = []

  constructor(treeName: string) {
    if (treeName === 'devboxDashboard') {
      const defaultSSHConfigPath = path.resolve(os.homedir(), '.ssh/config')

      parseSSHConfig(defaultSSHConfigPath).then((data) => {
        console.log(data)
        this.treeData = data as DevboxListItem[]
        this._onDidChangeTreeData.fire(undefined)
      })
    } else if (treeName === 'devboxFeedback') {
      this.treeData = [
        {
          hostName: 'Give me a feedback in the GitHub repository',
          host: '',
          port: 0,
        },
      ]
      this._onDidChangeTreeData.fire(undefined)
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined)
  }

  getTreeItem(element: MyTreeItem): vscode.TreeItem {
    return element
  }

  create(item: MyTreeItem) {
    vscode.commands.executeCommand('devbox.openWebview')
    vscode.window.showInformationMessage('create')
  }

  async open(item: MyTreeItem) {
    console.log(item)
    await vscode.commands.executeCommand('opensshremotes.openEmptyWindow', {
      host: `${item.sshDomain}:${item.sshPort}`,
    })
  }

  delete(item: MyTreeItem) {
    vscode.window.showInformationMessage('delete' + item.label)
  }

  getChildren(element?: MyTreeItem): Thenable<MyTreeItem[]> {
    if (element) {
      return Promise.resolve([])
    }
    const treeNodes = this.treeData.map((item) => {
      const treeItem = new MyTreeItem(
        item.host,
        item.host,
        item.port,
        vscode.TreeItemCollapsibleState.None
      )
      treeItem.tooltip = item.hostName
      return treeItem
    })

    return Promise.resolve(treeNodes)
  }
}

class MyTreeItem extends vscode.TreeItem {
  sshDomain: string
  sshPort: number

  constructor(
    label: string,
    sshDomain: string,
    sshPort: number,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState)
    this.sshDomain = sshDomain
    this.sshPort = sshPort

    this.command = {
      command: 'devboxDashboard.openDevbox',
      title: 'open Devbox',
      arguments: [this],
    }

    this.contextValue = 'myTreeItem'
  }
}
