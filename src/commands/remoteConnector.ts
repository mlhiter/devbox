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

    const message = vscode.window.showInformationMessage(
      `您的SSH登录命令: ${sshCommand},您的密码: ${sshPassword}`
    )

    const connectRemote = vscode.commands.executeCommand(
      'opensshremotes.addNewSshHost'
    )
    Promise.all([message, connectRemote])
  }
}
