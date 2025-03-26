import type { OutputChannel } from 'vscode'

export class Logger {
  private static outputChannel: OutputChannel

  static init(outputChannel: OutputChannel) {
    Logger.outputChannel = outputChannel
  }

  static log(message: string) {
    Logger.outputChannel.appendLine(message)
  }

  static info(message: string) {
    const log = `[INFO] ${new Date().toISOString()} ${message}`
    this.outputChannel.appendLine(log)
  }

  static error(message: string, error?: any) {
    const errorMessage = error ? `${message}: ${error.toString()}` : message
    const log = `[ERROR] ${new Date().toISOString()} ${errorMessage}`
    this.outputChannel.appendLine(log)
  }

  static debug(message: string) {
    if (process.env.NODE_ENV === 'development') {
      const log = `[DEBUG] ${new Date().toISOString()} ${message}`
      this.outputChannel.appendLine(log)
    }
  }

  static show() {
    this.outputChannel.show()
  }
}
