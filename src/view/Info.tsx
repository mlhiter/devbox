import React, { useState } from 'react'
import MyIcon from './MyIcon'
import { TemplateItem } from './App'

import './Info.css'

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
          <h2>Choose Template</h2>
        </div>
        <button onClick={handleSubmit}>Create</button>
      </div>
      <div className="template">
        <label>*Template</label>
        <div className="template-info">
          <MyIcon name={template.name} />
          <p>Quick Start a {template.title} Project</p>
        </div>
      </div>

      <div className="form-group">
        <label>*Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
        />
      </div>

      <h4>*Network Configuration</h4>
      {networks.map((networkConfig, index) => (
        <div className="network-config" key={index}>
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
                  handleNetworkChange(index, 'remoteAccess', e.target.checked)
                }
              />
              <label
                htmlFor={`remoteAccess-${index}`}
                className="switch"></label>
            </div>
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
            <span>Custom Domain</span>
            <button onClick={() => removeNetwork(index)}>
              <MyIcon name="delete" />
            </button>
          </div>
        </div>
      ))}
      <button onClick={addNetwork}>
        <MyIcon name="add" />
        Add Network
      </button>

      <div className="form-group">
        <label>Github Repo</label>
        <input
          type="text"
          value={githubRepo}
          onChange={(e) => setGithubRepo(e.target.value)}
          placeholder="Github Repository"
        />
      </div>

      <div className="form-group">
        <label>Project Description</label>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="What does this project do?"
        />
      </div>
    </div>
  )
}

export default Info
