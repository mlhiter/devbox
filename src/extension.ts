import * as os from 'os'
import * as vscode from 'vscode'

import Logger from './common/logger'
import { Webview } from './commands/webview'
import { RemoteSSHConnector } from './commands/remoteConnector'

export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "devbox" is now active!')

  const extensionId = context.extension.id
  const packageJSON = context.extension.packageJSON
  const logger = new Logger('Devbox')
  logger.info(
    `${extensionId}/${
      packageJSON.version
    } (${os.release()} ${os.platform()} ${os.arch()}) vscode/${
      vscode.version
    } (${vscode.env.appName})`
  )

  // webview
  const webview = new Webview(context)
  context.subscriptions.push(webview)

  // remote connector
  const remoteConnector = new RemoteSSHConnector(context)
  context.subscriptions.push(remoteConnector)
}

export function deactivate() {}
