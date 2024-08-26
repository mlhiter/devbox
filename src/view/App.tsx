import React, { useState } from 'react'
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
        name: 'spring-boot',
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

const TemplateCard = ({ item }: { item: { name: string; title: string } }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="card-content">
        <img className="icon" src={`public\${item.name}.svg`} />
        <div className="text-content">
          <h3>{item.title}</h3>
          <p>Quick Start a {item.title} Project</p>
        </div>
        {isHovered && <button className="use-btn">Use</button>}
      </div>
    </div>
  )
}

const App = () => {
  return (
    <div className="container">
      <h1>Template</h1>
      {templates.map((category) => (
        <div key={category.category}>
          <h2>{category.category}</h2>
          <div className="card-container">
            {category.items.map((item) => (
              <TemplateCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
