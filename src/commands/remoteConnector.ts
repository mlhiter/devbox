import path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import * as vscode from 'vscode'
import { Disposable } from '../common/dispose'
import { untildify } from '../common/files'
import { execSync } from 'child_process'

const defaultSSHConfigPath = path.resolve(os.homedir(), '.ssh/config')
const defaultSSHKeyPath = path.resolve(os.homedir(), '.ssh/sealos_ecdsa')

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
  private getSSHConfigPath() {
    const sshConfigPath = vscode.workspace
      .getConfiguration('remote.SSH')
      .get<string>('configFile')
    return sshConfigPath ? untildify(sshConfigPath) : defaultSSHConfigPath
  }

  private async connectRemoteSSH(args: {
    sshDomain: string
    sshPort: string
    base64PrivateKey: string
  }) {
    const { sshDomain, sshPort, base64PrivateKey } = args
    const sshUser = sshDomain.split('@')[0]
    const sshHost = sshDomain.split('@')[1]

    const normalPrivateKey = Buffer.from(base64PrivateKey, 'base64')

    vscode.window.showInformationMessage(
      `sshCommand:ssh ${sshDomain} -p ${sshPort};`
    )

    // 把ssh配置信息写入.ssh / config
    const sshConfig = `
Host ${sshHost}
  HostName ${sshHost}
  User ${sshUser}
  Port ${sshPort}
  IdentityFile ~/.ssh/sealos_ecdsa_${sshPort}`

    const sshConfigPath = this.getSSHConfigPath()

    try {
      const existingConfig = fs.readFileSync(sshConfigPath, 'utf8')
      const lines = existingConfig.split('\n')
      let hostExists = false
      let i = 0

      while (i < lines.length) {
        const line = lines[i].trim()
        if (line === `Host ${sshHost}`) {
          let j = i + 1
          while (j < lines.length && !lines[j].trim().startsWith('Host')) {
            if (lines[j].trim() === `Port ${sshPort}`) {
              hostExists = true
              break
            }
            j++
          }
          if (hostExists) {
            break
          }
        }
        i++
      }

      if (hostExists) {
        vscode.window.showWarningMessage(
          `SSH configuration for ${sshHost} with port ${sshPort} already exists.`
        )
        return // If configuration already exists, return directly
      } else {
        fs.appendFileSync(sshConfigPath, sshConfig)
        vscode.window.showInformationMessage(
          `SSH configuration for ${sshHost} with port ${sshPort} has been added.`
        )
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to write SSH configuration: ${error}`
      )
    }

    // 把ssh私钥写入.ssh
    try {
      const sshKeyPath = defaultSSHKeyPath + `_${sshPort}`
      console.log(normalPrivateKey)
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
      host: `${sshDomain}:${sshPort}`,
    })
  }
}
