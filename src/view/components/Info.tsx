import { useState } from 'react'
import MyIcon from './MyIcon'
import { TemplateItem } from './Template'

interface NetworkItem {
  port: number
  remoteAccess: boolean
  protocol: string
  publicDomain: string
  customDomain: string
}

const Info = (template: TemplateItem) => {
  const [projectName, setProjectName] = useState('')
  const [networks, setNetworks] = useState<NetworkItem[]>([
    {
      port: 80,
      remoteAccess: true,
      protocol: 'https',
      publicDomain: 'hello.cloud.xxx.io',
      customDomain: '',
    },
  ])
  const [githubRepo, setGithubRepo] = useState('')
  const [projectDescription, setProjectDescription] = useState('')

  const addNetwork = () => {
    setNetworks([
      ...networks,
      {
        port: 80,
        remoteAccess: true,
        protocol: 'https',
        publicDomain: 'hello.cloud.xxx.io',
        customDomain: '',
      },
    ])
  }

  const removeNetwork = (index: number) => {
    const newNetworks = networks.filter((_, i) => i !== index)
    setNetworks(newNetworks)
  }

  const handleNetworkChange = (
    index: number,
    field: string,
    value: boolean | string
  ) => {
    const newNetworks = networks.map((n, i) =>
      i === index ? { ...n, [field]: value } : n
    )
    setNetworks(newNetworks)
  }

  const handleSubmit = () => {
    console.log({ projectName, networks, githubRepo, projectDescription })
  }

  return (
    <div className="container">
      <div className="navbar">
        <div className="top-left-container">
          <MyIcon name="arrowLeft" />
          <div>Choose Template</div>
        </div>
        <button className="create-button" onClick={handleSubmit}>
          Create
        </button>
      </div>

      <div className="form-section">
        <div className="template">
          <label className="required-label">Template</label>
          <div className="template-info">
            <div>
              <MyIcon name={template.name} />
              {template.title}
            </div>
            <p>Quick Start a {template.title} Project</p>
          </div>
        </div>

        <div className="form-group">
          <label className="required-label">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Please input project name"
          />
        </div>

        <div className="required-label">Network Configuration</div>
        {networks.map((networkConfig, index) => (
          <div className="network-config" key={index}>
            <div className="network-row">
              <div className="form-group">
                <label>Port</label>
                <input
                  type="number"
                  value={networkConfig.port}
                  onChange={(e) =>
                    handleNetworkChange(index, 'port', e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Remote Access</label>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id={`remoteAccess-${index}`}
                    checked={networkConfig.remoteAccess}
                    onChange={(e) =>
                      handleNetworkChange(
                        index,
                        'remoteAccess',
                        e.target.checked
                      )
                    }
                  />
                  <label
                    htmlFor={`remoteAccess-${index}`}
                    className="switch"></label>
                </div>
              </div>
            </div>
            <div className="network-row">
              <div className="domain-input">
                <select
                  value={networkConfig.protocol}
                  onChange={(e) =>
                    handleNetworkChange(index, 'protocol', e.target.value)
                  }>
                  <option value="https">https://</option>
                  <option value="grpcs">grpcs://</option>
                  <option value="wss">wss://</option>
                </select>
                <input
                  type="text"
                  value={networkConfig.publicDomain}
                  onChange={(e) =>
                    handleNetworkChange(index, 'publicDomain', e.target.value)
                  }
                />
              </div>
              <span className="custom-domain">自定义域名</span>
              <button
                className="delete-button"
                onClick={() => removeNetwork(index)}>
                <MyIcon name="delete" />
              </button>
            </div>
          </div>
        ))}
        <button className="add-network-button" onClick={addNetwork}>
          <MyIcon name="add" />
          添加网络
        </button>

        <div className="form-group">
          <label>Github 仓库</label>
          <input
            type="text"
            value={githubRepo}
            onChange={(e) => setGithubRepo(e.target.value)}
            placeholder="Github 仓库"
          />
        </div>

        <div className="form-group">
          <label>项目描述</label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="这个项目是做什么的?"
          />
        </div>
      </div>
    </div>
  )
}

export default Info
