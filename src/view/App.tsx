import React, { useState } from 'react'
import MyIcon from './MyIcon'
import Info from './Info'

import './App.css'

const templates = [
  {
    category: 'Language',
    items: [
      {
        title: 'Go',
        name: 'go',
      },
      {
        title: 'Python',
        name: 'python',
      },
      {
        title: 'Node.js',
        name: 'nodejs',
      },
      { title: 'C', name: 'c' },
      { title: 'Rust', name: 'rust' },
    ],
  },
  {
    category: 'Framework',
    items: [
      { name: 'gin', title: 'Gin' },
      {
        name: 'hertz',
        title: 'Hertz',
      },
      { title: 'Flask', name: 'flask' },
      {
        title: 'Vue.js',
        name: 'vue',
      },
      {
        title: 'Next.js',
        name: 'nextjs',
      },
      {
        title: 'SpringBoot',
        name: 'springBoot',
      },
    ],
  },
  {
    category: 'Operating System',
    items: [
      {
        title: 'Ubuntu',
        name: 'ubuntu',
      },
    ],
  },
]

export interface TemplateItem {
  name: string
  title: string
}

const TemplateCard = ({
  item,
  onUse,
}: {
  item: TemplateItem
  onUse: ({ name, title }: TemplateItem) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onUse({ name: item.name, title: item.title })}>
      <div className="card-content">
        <MyIcon name={item.name} />
        <div className="text-content">
          <h3>{item.title}</h3>
          <p>Quick Start a {item.title} Project</p>
        </div>
        <button
          className="use-btn"
          style={{ visibility: isHovered ? 'visible' : 'hidden' }}
          onClick={() => onUse({ name: item.name, title: item.title })}>
          Use
        </button>
      </div>
    </div>
  )
}

const App = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(
    null
  )

  const handleUseTemplate = ({
    name,
    title,
  }: {
    name: string
    title: string
  }) => {
    setSelectedTemplate({ name, title })
  }

  if (selectedTemplate) {
    return <Info {...selectedTemplate} />
  }

  return (
    <div className="container">
      <h1>Template</h1>
      {templates.map((category) => (
        <div key={category.category}>
          <h2>{category.category}</h2>
          <div className="card-container">
            {category.items.map((item) => (
              <TemplateCard
                key={item.name}
                item={item}
                onUse={handleUseTemplate}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
