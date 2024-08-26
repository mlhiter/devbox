import * as vscode from 'vscode'
import { Disposable } from '../common/dispose'

export class RemoteSSHConnector extends Disposable {
  constructor(context: vscode.ExtensionContext) {
    super()
    if (context.extension.extensionKind === vscode.ExtensionKind.UI) {
      this._register(
        vscode.commands.registerCommand('devbox.connectRemoteSSH', (args) =>
          this.connectRemoteSSH(args)
        )
      )
    }
  }

  private async connectRemoteSSH(args: {
    sshDomain: string
    sshPort: string
    password: string
  }) {
    const { sshDomain, sshPort, password } = args
    const sshCommand = `ssh ${sshDomain} -p ${sshPort}`
    const sshPassword = password

    await vscode.window.showInformationMessage(
      `SSH Domain: ${sshDomain}, Password: ${sshPassword}`
    )

    if (sshDomain) {
      await vscode.commands.executeCommand('opensshremotes.addNewSshHost')
    }
  }
}
