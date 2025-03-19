import { ApiConfiguration } from '../../../src/shared/api'

export function validateApiConfiguration(apiConfiguration?: ApiConfiguration): string | undefined {
  if (apiConfiguration) {
    switch (apiConfiguration.apiProvider) {
      case 'openai':
        if (!apiConfiguration.openAiBaseUrl || !apiConfiguration.openAiApiKey || !apiConfiguration.openAiModelId) {
          return 'You must provide a valid base URL, API key, and model ID.'
        }
        break
    }
  }
  return undefined
}
