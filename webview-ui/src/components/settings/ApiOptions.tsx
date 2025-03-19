import styled from 'styled-components'
import { Fragment, memo, useMemo, useState } from 'react'
import { VSCodeCheckbox, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeTextField } from '@vscode/webview-ui-toolkit/react'

import {
  anthropicDefaultModelId,
  anthropicModels,
  ApiConfiguration,
  ApiProvider,
  azureOpenAiDefaultApiVersion,
  geminiModels,
  ModelInfo,
  openAiModelInfoSaneDefaults,
} from '../../../../src/shared/api'
import { ModelDescriptionMarkdown } from './OpenRouterModelPicker'
import { useExtensionState } from '../../context/ExtensionStateContext'
import { getAsVar, VSC_DESCRIPTION_FOREGROUND } from '../../utils/vscStyles'

interface ApiOptionsProps {
  showModelOptions: boolean
  apiErrorMessage?: string
  modelIdErrorMessage?: string
  isPopup?: boolean
}

// This is necessary to ensure dropdown opens downward, important for when this is used in popup
const DROPDOWN_Z_INDEX = 1001 // Higher than the OpenRouterModelPicker's and ModelSelectorTooltip's z-index

const DropdownContainer = styled.div<{ zIndex?: number }>`
  position: relative;
  z-index: ${(props) => props.zIndex || DROPDOWN_Z_INDEX};

  // Force dropdowns to open downward
  & vscode-dropdown::part(listbox) {
    position: absolute !important;
    top: 100% !important;
    bottom: auto !important;
  }
`

declare module 'vscode' {
  interface LanguageModelChatSelector {
    vendor?: string
    family?: string
    version?: string
    id?: string
  }
}

const ApiOptions = ({ showModelOptions, apiErrorMessage, modelIdErrorMessage, isPopup }: ApiOptionsProps) => {
  const { apiConfiguration, setApiConfiguration, uriScheme } = useExtensionState()
  const [modelConfigurationSelected, setModelConfigurationSelected] = useState(false)

  const handleInputChange = (field: keyof ApiConfiguration) => (event: any) => {
    setApiConfiguration({
      ...apiConfiguration,
      [field]: event.target.value,
    })
  }

  const { selectedProvider, selectedModelId, selectedModelInfo } = useMemo(() => {
    return normalizeApiConfiguration(apiConfiguration)
  }, [apiConfiguration])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: isPopup ? -10 : 0 }}>
      <DropdownContainer className="dropdown-container">
        <label htmlFor="api-provider">
          <span style={{ fontWeight: 500 }}>API Provider</span>
        </label>
        <VSCodeDropdown
          id="api-provider"
          value={selectedProvider}
          onChange={handleInputChange('apiProvider')}
          style={{
            minWidth: 130,
            position: 'relative',
          }}>
          <VSCodeOption value="openai">OpenAI Compatible</VSCodeOption>
        </VSCodeDropdown>
      </DropdownContainer>

      {selectedProvider === 'openai' && (
        <div>
          <VSCodeTextField
            value={apiConfiguration?.openAiBaseUrl || ''}
            style={{ width: '100%' }}
            type="url"
            onInput={handleInputChange('openAiBaseUrl')}
            placeholder={'Enter base URL...'}>
            <span style={{ fontWeight: 500 }}>Base URL</span>
          </VSCodeTextField>
          <VSCodeTextField
            value={apiConfiguration?.openAiApiKey || ''}
            style={{ width: '100%' }}
            type="password"
            onInput={handleInputChange('openAiApiKey')}
            placeholder="Enter API Key...">
            <span style={{ fontWeight: 500 }}>API Key</span>
          </VSCodeTextField>
          <VSCodeTextField
            value={apiConfiguration?.openAiModelId || ''}
            style={{ width: '100%' }}
            onInput={handleInputChange('openAiModelId')}
            placeholder={'Enter Model ID...'}>
            <span style={{ fontWeight: 500 }}>Model ID</span>
          </VSCodeTextField>
          <div
            style={{
              color: getAsVar(VSC_DESCRIPTION_FOREGROUND),
              display: 'flex',
              margin: '10px 0',
              cursor: 'pointer',
              alignItems: 'center',
            }}
            onClick={() => setModelConfigurationSelected((val) => !val)}>
            <span
              className={`codicon ${modelConfigurationSelected ? 'codicon-chevron-down' : 'codicon-chevron-right'}`}
              style={{
                marginRight: '4px',
              }}></span>
            <span
              style={{
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
              Model Configuration
            </span>
          </div>
          {modelConfigurationSelected && (
            <>
              <VSCodeCheckbox
                checked={!!apiConfiguration?.openAiModelInfo?.supportsImages}
                onChange={(e: any) => {
                  const isChecked = e.target.checked === true
                  const modelInfo = apiConfiguration?.openAiModelInfo
                    ? apiConfiguration.openAiModelInfo
                    : { ...openAiModelInfoSaneDefaults }
                  modelInfo.supportsImages = isChecked
                  setApiConfiguration({
                    ...apiConfiguration,
                    openAiModelInfo: modelInfo,
                  })
                }}>
                Supports Images
              </VSCodeCheckbox>
              <VSCodeCheckbox
                checked={!!apiConfiguration?.openAiModelInfo?.supportsComputerUse}
                onChange={(e: any) => {
                  const isChecked = e.target.checked === true
                  let modelInfo = apiConfiguration?.openAiModelInfo
                    ? apiConfiguration.openAiModelInfo
                    : { ...openAiModelInfoSaneDefaults }
                  modelInfo = { ...modelInfo, supportsComputerUse: isChecked }
                  setApiConfiguration({
                    ...apiConfiguration,
                    openAiModelInfo: modelInfo,
                  })
                }}>
                Supports Computer Use
              </VSCodeCheckbox>
              <div style={{ display: 'flex', gap: 10, marginTop: '5px' }}>
                <VSCodeTextField
                  value={
                    apiConfiguration?.openAiModelInfo?.contextWindow
                      ? apiConfiguration.openAiModelInfo.contextWindow.toString()
                      : openAiModelInfoSaneDefaults.contextWindow?.toString()
                  }
                  style={{ flex: 1 }}
                  onInput={(input: any) => {
                    const modelInfo = apiConfiguration?.openAiModelInfo
                      ? apiConfiguration.openAiModelInfo
                      : { ...openAiModelInfoSaneDefaults }
                    modelInfo.contextWindow = Number(input.target.value)
                    setApiConfiguration({
                      ...apiConfiguration,
                      openAiModelInfo: modelInfo,
                    })
                  }}>
                  <span style={{ fontWeight: 500 }}>Context Window Size</span>
                </VSCodeTextField>
                <VSCodeTextField
                  value={
                    apiConfiguration?.openAiModelInfo?.maxTokens
                      ? apiConfiguration.openAiModelInfo.maxTokens.toString()
                      : openAiModelInfoSaneDefaults.maxTokens?.toString()
                  }
                  style={{ flex: 1 }}
                  onInput={(input: any) => {
                    const modelInfo = apiConfiguration?.openAiModelInfo
                      ? apiConfiguration.openAiModelInfo
                      : { ...openAiModelInfoSaneDefaults }
                    modelInfo.maxTokens = input.target.value
                    setApiConfiguration({
                      ...apiConfiguration,
                      openAiModelInfo: modelInfo,
                    })
                  }}>
                  <span style={{ fontWeight: 500 }}>Max Output Tokens</span>
                </VSCodeTextField>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: '5px' }}>
                <VSCodeTextField
                  value={
                    apiConfiguration?.openAiModelInfo?.inputPrice
                      ? apiConfiguration.openAiModelInfo.inputPrice.toString()
                      : openAiModelInfoSaneDefaults.inputPrice?.toString()
                  }
                  style={{ flex: 1 }}
                  onInput={(input: any) => {
                    const modelInfo = apiConfiguration?.openAiModelInfo
                      ? apiConfiguration.openAiModelInfo
                      : { ...openAiModelInfoSaneDefaults }
                    modelInfo.inputPrice = input.target.value
                    setApiConfiguration({
                      ...apiConfiguration,
                      openAiModelInfo: modelInfo,
                    })
                  }}>
                  <span style={{ fontWeight: 500 }}>Input Price / 1M tokens</span>
                </VSCodeTextField>
                <VSCodeTextField
                  value={
                    apiConfiguration?.openAiModelInfo?.outputPrice
                      ? apiConfiguration.openAiModelInfo.outputPrice.toString()
                      : openAiModelInfoSaneDefaults.outputPrice?.toString()
                  }
                  style={{ flex: 1 }}
                  onInput={(input: any) => {
                    const modelInfo = apiConfiguration?.openAiModelInfo
                      ? apiConfiguration.openAiModelInfo
                      : { ...openAiModelInfoSaneDefaults }
                    modelInfo.outputPrice = input.target.value
                    setApiConfiguration({
                      ...apiConfiguration,
                      openAiModelInfo: modelInfo,
                    })
                  }}>
                  <span style={{ fontWeight: 500 }}>Output Price / 1M tokens</span>
                </VSCodeTextField>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: '5px' }}>
                <VSCodeTextField
                  value={
                    apiConfiguration?.openAiModelInfo?.temperature
                      ? apiConfiguration.openAiModelInfo.temperature.toString()
                      : openAiModelInfoSaneDefaults.temperature?.toString()
                  }
                  onInput={(input: any) => {
                    const modelInfo = apiConfiguration?.openAiModelInfo
                      ? apiConfiguration.openAiModelInfo
                      : { ...openAiModelInfoSaneDefaults }

                    // Check if the input ends with a decimal point or has trailing zeros after decimal
                    const value = input.target.value
                    const shouldPreserveFormat = value.endsWith('.') || (value.includes('.') && value.endsWith('0'))

                    modelInfo.temperature =
                      value === ''
                        ? openAiModelInfoSaneDefaults.temperature
                        : shouldPreserveFormat
                        ? value // Keep as string to preserve decimal format
                        : parseFloat(value)

                    setApiConfiguration({
                      ...apiConfiguration,
                      openAiModelInfo: modelInfo,
                    })
                  }}>
                  <span style={{ fontWeight: 500 }}>Temperature</span>
                </VSCodeTextField>
              </div>
            </>
          )}
          <p
            style={{
              fontSize: '12px',
              marginTop: 3,
              color: 'var(--vscode-descriptionForeground)',
            }}>
            <span style={{ color: 'var(--vscode-errorForeground)' }}>
              (<span style={{ fontWeight: 500 }}>Note:</span> Cline uses complex prompts and works best with Claude models. Less
              capable models may not work as expected.)
            </span>
          </p>
        </div>
      )}

      {apiErrorMessage && (
        <p
          style={{
            margin: '-10px 0 4px 0',
            fontSize: 12,
            color: 'var(--vscode-errorForeground)',
          }}>
          {apiErrorMessage}
        </p>
      )}

      {modelIdErrorMessage && (
        <p
          style={{
            margin: '-10px 0 4px 0',
            fontSize: 12,
            color: 'var(--vscode-errorForeground)',
          }}>
          {modelIdErrorMessage}
        </p>
      )}
    </div>
  )
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export const ModelInfoView = ({
  selectedModelId,
  modelInfo,
  isDescriptionExpanded,
  setIsDescriptionExpanded,
  isPopup,
}: {
  selectedModelId: string
  modelInfo: ModelInfo
  isDescriptionExpanded: boolean
  setIsDescriptionExpanded: (isExpanded: boolean) => void
  isPopup?: boolean
}) => {
  const isGemini = Object.keys(geminiModels).includes(selectedModelId)

  const infoItems = [
    modelInfo.description && (
      <ModelDescriptionMarkdown
        key="description"
        markdown={modelInfo.description}
        isExpanded={isDescriptionExpanded}
        setIsExpanded={setIsDescriptionExpanded}
        isPopup={isPopup}
      />
    ),
    <ModelInfoSupportsItem
      key="supportsImages"
      isSupported={modelInfo.supportsImages ?? false}
      supportsLabel="Supports images"
      doesNotSupportLabel="Does not support images"
    />,
    <ModelInfoSupportsItem
      key="supportsComputerUse"
      isSupported={modelInfo.supportsComputerUse ?? false}
      supportsLabel="Supports computer use"
      doesNotSupportLabel="Does not support computer use"
    />,
    !isGemini && (
      <ModelInfoSupportsItem
        key="supportsPromptCache"
        isSupported={modelInfo.supportsPromptCache}
        supportsLabel="Supports prompt caching"
        doesNotSupportLabel="Does not support prompt caching"
      />
    ),
    modelInfo.maxTokens !== undefined && modelInfo.maxTokens > 0 && (
      <span key="maxTokens">
        <span style={{ fontWeight: 500 }}>Max output:</span> {modelInfo.maxTokens?.toLocaleString()} tokens
      </span>
    ),
    modelInfo.inputPrice !== undefined && modelInfo.inputPrice > 0 && (
      <span key="inputPrice">
        <span style={{ fontWeight: 500 }}>Input price:</span> {formatPrice(modelInfo.inputPrice)}/million tokens
      </span>
    ),
    modelInfo.supportsPromptCache && modelInfo.cacheWritesPrice && (
      <span key="cacheWritesPrice">
        <span style={{ fontWeight: 500 }}>Cache writes price:</span> {formatPrice(modelInfo.cacheWritesPrice || 0)}
        /million tokens
      </span>
    ),
    modelInfo.supportsPromptCache && modelInfo.cacheReadsPrice && (
      <span key="cacheReadsPrice">
        <span style={{ fontWeight: 500 }}>Cache reads price:</span> {formatPrice(modelInfo.cacheReadsPrice || 0)}/million tokens
      </span>
    ),
    modelInfo.outputPrice !== undefined && modelInfo.outputPrice > 0 && (
      <span key="outputPrice">
        <span style={{ fontWeight: 500 }}>Output price:</span> {formatPrice(modelInfo.outputPrice)}/million tokens
      </span>
    ),
    isGemini && (
      <span key="geminiInfo" style={{ fontStyle: 'italic' }}>
        * Free up to {selectedModelId && selectedModelId.includes('flash') ? '15' : '2'} requests per minute. After that, billing
        depends on prompt size.{' '}
        <VSCodeLink href="https://ai.google.dev/pricing" style={{ display: 'inline', fontSize: 'inherit' }}>
          For more info, see pricing details.
        </VSCodeLink>
      </span>
    ),
  ].filter(Boolean)

  return (
    <p
      style={{
        fontSize: '12px',
        marginTop: '2px',
        color: 'var(--vscode-descriptionForeground)',
      }}>
      {infoItems.map((item, index) => (
        <Fragment key={index}>
          {item}
          {index < infoItems.length - 1 && <br />}
        </Fragment>
      ))}
    </p>
  )
}

const ModelInfoSupportsItem = ({
  isSupported,
  supportsLabel,
  doesNotSupportLabel,
}: {
  isSupported: boolean
  supportsLabel: string
  doesNotSupportLabel: string
}) => (
  <span
    style={{
      fontWeight: 500,
      color: isSupported ? 'var(--vscode-charts-green)' : 'var(--vscode-errorForeground)',
    }}>
    <i
      className={`codicon codicon-${isSupported ? 'check' : 'x'}`}
      style={{
        marginRight: 4,
        marginBottom: isSupported ? 1 : -1,
        fontSize: isSupported ? 11 : 13,
        fontWeight: 700,
        display: 'inline-block',
        verticalAlign: 'bottom',
      }}></i>
    {isSupported ? supportsLabel : doesNotSupportLabel}
  </span>
)

export function normalizeApiConfiguration(apiConfiguration?: ApiConfiguration): {
  selectedProvider: ApiProvider
  selectedModelId: string
  selectedModelInfo: ModelInfo
} {
  const provider = apiConfiguration?.apiProvider || 'openai'
  const modelId = apiConfiguration?.apiModelId

  const getProviderData = (models: Record<string, ModelInfo>, defaultId: string) => {
    let selectedModelId: string
    let selectedModelInfo: ModelInfo
    if (modelId && modelId in models) {
      selectedModelId = modelId
      selectedModelInfo = models[modelId]
    } else {
      selectedModelId = defaultId
      selectedModelInfo = models[defaultId]
    }
    return {
      selectedProvider: provider,
      selectedModelId,
      selectedModelInfo,
    }
  }
  switch (provider) {
    case 'openai':
      return {
        selectedProvider: provider,
        selectedModelId: apiConfiguration?.openAiModelId || '',
        selectedModelInfo: apiConfiguration?.openAiModelInfo || openAiModelInfoSaneDefaults,
      }
    default:
      return getProviderData(anthropicModels, anthropicDefaultModelId)
  }
}

export default memo(ApiOptions)
