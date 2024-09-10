import path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import * as vscode from 'vscode'
import { Disposable } from '../common/dispose'
import { execSync } from 'child_process'

const defaultDevboxSSHConfigPath = path.resolve(
  os.homedir(),
  '.ssh/sealos/devbox_config'
)
const defaultSSHConfigPath = path.resolve(os.homedir(), '.ssh/config')
const defaultSSHKeyPath = path.resolve(os.homedir(), '.ssh')

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

  private async ensureRemoteSSHExtInstalled(): Promise<boolean> {
    const isOfficialVscode =
      vscode.env.uriScheme === 'vscode' ||
      vscode.env.uriScheme === 'vscode-insiders'
    if (!isOfficialVscode) {
      return true
    }

    const msVscodeRemoteExt = vscode.extensions.getExtension(
      'ms-vscode-remote.remote-ssh'
    )
    if (msVscodeRemoteExt) {
      return true
    }

    const install = 'Install'
    const cancel = 'Cancel'

    const action = await vscode.window.showInformationMessage(
      'Please install "Remote - SSH" extension to connect to a Gitpod workspace.',
      { modal: true },
      install,
      cancel
    )

    if (action === cancel) {
      return false
    }

    vscode.window.showInformationMessage(
      'Installing "ms-vscode-remote.remote-ssh" extension'
    )

    await vscode.commands.executeCommand(
      'extension.open',
      'ms-vscode-remote.remote-ssh'
    )
    await vscode.commands.executeCommand(
      'workbench.extensions.installExtension',
      'ms-vscode-remote.remote-ssh'
    )

    return true
  }
  private async modifiedRemoteSSHConfig(sshHostLabel: string) {
    const existingSSHHostPlatforms = vscode.workspace
      .getConfiguration('remote.SSH')
      .get<{ [host: string]: string }>('remotePlatform', {})

    await vscode.workspace
      .getConfiguration('remote.SSH')
      .update(
        'remotePlatform',
        { ...existingSSHHostPlatforms, [sshHostLabel]: 'linux' },
        vscode.ConfigurationTarget.Global
      )
    await vscode.workspace
      .getConfiguration('remote.SSH')
      .update('useExecServer', false, vscode.ConfigurationTarget.Global)
    await vscode.workspace
      .getConfiguration('remote.SSH')
      .update('localServerDownload', 'off', vscode.ConfigurationTarget.Global)
  }

  private async connectRemoteSSH(args: {
    sshDomain: string
    sshPort: string
    base64PrivateKey: string
    sshHostLabel: string
  }) {
    this.ensureRemoteSSHExtInstalled()

    const { sshDomain, sshPort, base64PrivateKey, sshHostLabel } = args

    const randomSuffix = Math.random().toString(36).substring(2, 15)
    const suffixSSHHostLabel = `${sshHostLabel}/${randomSuffix}`

    this.modifiedRemoteSSHConfig(suffixSSHHostLabel)

    const sshUser = sshDomain.split('@')[0]
    const sshHost = sshDomain.split('@')[1]

    // sshHostLabel: usw.sailos.io/ns-admin/devbox-1
    // identityFileSSHLabel: usw.sailos.io_ns-admin_devbox-1
    const identityFileSSHLabel = sshHostLabel.replace(/\//g, '_')

    const normalPrivateKey = Buffer.from(base64PrivateKey, 'base64')

    vscode.window.showInformationMessage(
      `sshCommand:ssh ${sshDomain} -p ${sshPort};`
    )

    const sshConfig = `
Host ${suffixSSHHostLabel}
  HostName ${sshHost}
  User ${sshUser}
  Port ${sshPort}
  IdentityFile ~/.ssh/sealos/${identityFileSSHLabel}`

    try {
      // ensure .ssh/config exists
      if (!fs.existsSync(defaultSSHConfigPath)) {
        fs.writeFileSync(defaultSSHConfigPath, '', 'utf8')
      }
      // ensure .ssh/sealos/devbox_config exists
      if (!fs.existsSync(defaultDevboxSSHConfigPath)) {
        fs.mkdirSync(path.resolve(os.homedir(), '.ssh/sealos'), {
          recursive: true,
        })
        fs.writeFileSync(defaultDevboxSSHConfigPath, '', 'utf8')
      }
      // ensure .ssh/config includes .ssh/sealos/devbox_config
      const existingSSHConfig = fs.readFileSync(defaultSSHConfigPath, 'utf8')
      if (!existingSSHConfig.includes('Include ~/.ssh/sealos/devbox_config')) {
        let existingSSHConfig = fs.readFileSync(defaultSSHConfigPath, 'utf-8')
        const newConfig =
          'Include ~/.ssh/sealos/devbox_config\n' + existingSSHConfig
        // 写入文件
        fs.writeFileSync(defaultSSHConfigPath, newConfig)
      }

      // write ssh_config to .ssh/sealos/devbox_config
      const existingConfig = fs.readFileSync(defaultDevboxSSHConfigPath, 'utf8')
      const lines = existingConfig.split('\n')
      let hostExists = false

      // check if the host already exists
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.startsWith('Host ')) {
          const currentHost = line.split(' ')[1]
          if (currentHost === suffixSSHHostLabel) {
            hostExists = true
            break
          }
        }
      }

      if (hostExists) {
        vscode.window.showInformationMessage(
          `SSH configuration for ${sshHost} with port ${sshPort} already exists.`
        )
      } else {
        fs.appendFileSync(defaultDevboxSSHConfigPath, sshConfig)
        vscode.window.showInformationMessage(
          `SSH configuration for ${sshHost} with port ${sshPort} has been added.`
        )
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to write SSH configuration: ${error}`
      )
    }

    // create sealos privateKey file in .ssh/sealos
    try {
      const sshKeyPath = defaultSSHKeyPath + `/sealos/${identityFileSSHLabel}`
      fs.writeFileSync(sshKeyPath, normalPrivateKey)

      // 针对mac和windows区别处理
      if (os.platform() === 'win32') {
        // 移除继承的权限
        execSync(`icacls "${sshKeyPath}" /inheritance:r`)
        // 为当前用户授予完全控制权限
        execSync(`icacls "${sshKeyPath}" /grant:r ${process.env.USERNAME}:F`)
        // 确保其他用户无法访问
        execSync(`icacls "${sshKeyPath}" /remove:g everyone`)
      } else {
        // 设置文件权限为 600（仅文件所有者可读写）
        execSync(`chmod 600 "${sshKeyPath}"`)
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to write SSH private key: ${error}`
      )
    }

    // 创建一个新的连接并打开新的窗口
    await vscode.commands.executeCommand('opensshremotes.openEmptyWindow', {
      host: `${suffixSSHHostLabel}`,
    })
  }
}
