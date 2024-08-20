import * as vscode from 'vscode'

import { Disposable } from '../common/dispose'

export class TreeView extends Disposable {
  constructor(context: vscode.ExtensionContext) {
    super()
    if (context.extension.extensionKind === vscode.ExtensionKind.UI) {
      this._register(
        vscode.window.createTreeView('devbox-view', {
          treeDataProvider: new MyTreeDataProvider(),
        })
      )
    }
  }
}

class MyTreeDataProvider implements vscode.TreeDataProvider<MyTreeItem> {
  getTreeItem(element: MyTreeItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: MyTreeItem): Thenable<MyTreeItem[]> {
    return Promise.resolve([new MyTreeItem('Item 1'), new MyTreeItem('Item 2')])
  }
}

class MyTreeItem extends vscode.TreeItem {
  constructor(label: string) {
    super(label)
  }
}
