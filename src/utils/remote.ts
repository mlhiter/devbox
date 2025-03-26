import * as vscode from 'vscode'

export async function installRemoteExtensions() {
  const extensionsToInstall = ['streetsidesoftware.code-spell-checker']

  for (const extId of extensionsToInstall) {
    try {
      await vscode.commands.executeCommand(
        'workbench.extensions.installExtension',
        extId
      )
    } catch (err) {
      vscode.window.showWarningMessage(
        `Install ${extId} failed: ${err.message}`
      )
    }
  }
}
