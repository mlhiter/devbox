import * as vscode from 'vscode'

import { Disposable } from '../common/dispose'

export class TreeView extends Disposable {
  constructor(context: vscode.ExtensionContext) {
    super()
    if (context.extension.extensionKind === vscode.ExtensionKind.UI) {
      const myTreeDataProvider = new MyTreeDataProvider()
      // views
      this._register(
        vscode.window.createTreeView('devboxDashboard', {
          treeDataProvider: myTreeDataProvider,
        })
      )
      this._register(
        vscode.window.createTreeView('devboxFeedback', {
          treeDataProvider: myTreeDataProvider,
        })
      )
      // commands
      this._register(
        vscode.commands.registerCommand('devboxDashboard.refresh', () => {
          vscode.window.showInformationMessage('refresh')
          myTreeDataProvider.refresh()
        })
      )
      this._register(
        vscode.commands.registerCommand('devboxDashboard.addDevbox', () => {
          vscode.window.showInformationMessage('add')
          myTreeDataProvider.add()
        })
      )
      this._register(
        vscode.commands.registerCommand('devboxDashboard.openDevbox', () => {
          vscode.window.showInformationMessage('open')
          myTreeDataProvider.open()
        })
      )
      this._register(
        vscode.commands.registerCommand('devboxDashboard.deleteDevbox', () => {
          vscode.window.showInformationMessage('delete')
          myTreeDataProvider.delete()
        })
      )
    }
  }
}

class MyTreeDataProvider implements vscode.TreeDataProvider<MyTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<MyTreeItem | undefined> =
    new vscode.EventEmitter<MyTreeItem | undefined>()
  readonly onDidChangeTreeData: vscode.Event<MyTreeItem | undefined> =
    this._onDidChangeTreeData.event

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined)
  }

  getTreeItem(element: MyTreeItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: MyTreeItem): Thenable<MyTreeItem[]> {
    if (element) {
      return Promise.resolve([])
    }

    // get data from server
    const treeData = [
      {
        name: 'devbox1',
        status: 'Running',
      },
      {
        name: 'devbox2',
        status: 'Stopped',
      },
    ]
    const treeNodes = treeData.map((item) => {
      const treeItem = new MyTreeItem(
        `${item.name} - ${item.status}`,
        vscode.TreeItemCollapsibleState.None
      )
      treeItem.tooltip = item.name
      return treeItem
    })

    return Promise.resolve(treeNodes)
  }
}

class MyTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState)

    this.command = {
      command: 'yourExtension.showDetails',
      title: 'Show Details',
      arguments: [this],
    }

    this.contextValue = 'myTreeItem'
  }
}
