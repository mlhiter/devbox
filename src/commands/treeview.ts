import * as vscode from 'vscode'

import { Disposable } from '../common/dispose'
import { getDevboxList } from '../api'
import { DevboxListItem } from '../types/devbox'

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
          myTreeDataProvider.refresh()
        })
      )
      this._register(
        vscode.commands.registerCommand(
          'devboxDashboard.createDevbox',
          (item: MyTreeItem) => {
            myTreeDataProvider.create(item)
          }
        )
      )
      this._register(
        vscode.commands.registerCommand(
          'devboxDashboard.openDevbox',
          (item: MyTreeItem) => {
            myTreeDataProvider.open(item)
          }
        )
      )
      this._register(
        vscode.commands.registerCommand(
          'devboxDashboard.deleteDevbox',
          (item: MyTreeItem) => {
            myTreeDataProvider.delete(item)
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

  constructor() {
    getDevboxList().then((data) => {
      this.treeData = data
      this._onDidChangeTreeData.fire(undefined)
    })
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

  open(item: MyTreeItem) {
    vscode.window.showInformationMessage('open' + item.label)
  }

  delete(item: MyTreeItem) {
    vscode.window.showInformationMessage('delete' + item.label)
  }

  getChildren(element?: MyTreeItem): Thenable<MyTreeItem[]> {
    if (element) {
      return Promise.resolve([])
    }
    // get data from server
    const treeNodes = this.treeData.map((item) => {
      const treeItem = new MyTreeItem(
        item.name,
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
