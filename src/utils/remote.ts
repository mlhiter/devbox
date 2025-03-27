import * as vscode from 'vscode'

export type IDE =
  | 'cursor'
  | 'vscode'
  | 'windsurf'
  | 'trae'
  | 'vscode-insiders'
  | 'trae-cn'

export async function installRemoteExtensions() {
  const extensionsToInstall = ['streetsidesoftware.code-spell-checker']

  const ide = vscode.env.uriScheme as IDE

  const extensionsPath = getExtensionsPath(ide)
  const extensionDir = await vscode.workspace.fs.readDirectory(
    vscode.Uri.parse(extensionsPath)
  )

  for (const extId of extensionsToInstall) {
    try {
      const isInstalled = extensionDir.some((file) =>
        file[0].startsWith(extId.toLowerCase())
      )

      if (!isInstalled) {
        await vscode.commands.executeCommand(
          'workbench.extensions.installExtension',
          extId
        )
        console.log(`Extension ${extId} installed successfully`)
      } else {
        console.log(`Extension ${extId} is already installed`)
      }
    } catch (err) {
      vscode.window.showWarningMessage(
        `Install ${extId} failed: ${err.message}`
      )
    }
  }
}

export const getExtensionsPath = (ide: IDE) => {
  const serverName = serverNameMap[ide]
  return `vscode-remote://ssh-remote+/home/devbox/${serverName}/extensions`
}

const serverNameMap = {
  cursor: '.cursor-server',
  vscode: '.vscode-server',
  'vscode-insiders': '.vscode-server-insiders',
  windsurf: '.windsurf-server',
  trae: '.trae-server',
  'trae-cn': '.trae-cn-server',
}
