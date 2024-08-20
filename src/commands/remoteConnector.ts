import * as vscode from 'vscode'
import { Disposable } from '../common/dispose'

export class RemoteSSHConnector extends Disposable {
  constructor(context: vscode.ExtensionContext) {
    super()
    if (context.extension.extensionKind === vscode.ExtensionKind.UI) {
      this._register(
        vscode.commands.registerCommand(
          'devbox.connectRemoteSSH',
          this.connectRemoteSSH.bind(this)
        )
      )
    }
  }

  private async connectRemoteSSH() {
    const host = await vscode.window.showInputBox({
      placeHolder: 'Enter the SSH host (e.g., user@hostname)',
      prompt: 'SSH Host',
    })

    if (host) {
      await vscode.commands.executeCommand(
        'opensshremotes.openEmptyWindow',
        host
      )
    }
  }
}
