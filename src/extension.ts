import * as vscode from 'vscode'
import * as os from 'os'
import Log from './common/logger'
import { RemoteSSHConnector } from './remoteConnector'

export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "devbox" is now active!')

  const extensionId = context.extension.id
  const packageJSON = context.extension.packageJSON
  const logger = new Log('Devbox')
  logger.info(
    `${extensionId}/${
      packageJSON.version
    } (${os.release()} ${os.platform()} ${os.arch()}) vscode/${
      vscode.version
    } (${vscode.env.appName})`
  )

  const remoteConnector = new RemoteSSHConnector(context)
  context.subscriptions.push(remoteConnector)
}

export function deactivate() {}
