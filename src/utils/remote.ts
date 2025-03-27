import * as vscode from 'vscode'

export type IDE =
  | 'cursor'
  | 'vscode'
  | 'windsurf'
  | 'trae'
  | 'vscode-insiders'
  | 'trae-cn'

export async function installRemoteExtensions() {
  const extensionsToInstall = ['mlhiter.sline']
  const ide = vscode.env.uriScheme as IDE
  const extensionsPath = getExtensionsPath(ide)

  try {
    const extensionsJsonPath = vscode.Uri.parse(
      `${extensionsPath}/extensions.json`
    )
    const extensionsJsonContent = await vscode.workspace.fs.readFile(
      extensionsJsonPath
    )
    const installedExtensions = JSON.parse(
      Buffer.from(extensionsJsonContent).toString()
    )

    for (const extId of extensionsToInstall) {
      const isInstalled = installedExtensions.some(
        (ext: { identifier: { id: string } }) => ext.identifier.id === extId
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
    }
  } catch (err) {
    vscode.window.showWarningMessage(
      `Read or install extensions failed: ${err.message}`
    )
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
