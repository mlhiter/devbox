import React from 'react'
import { ReactComponent as CIcon } from './public/c.svg'
import { ReactComponent as FlaskIcon } from './public/flask.svg'
import { ReactComponent as GinIcon } from './public/gin.svg'
import { ReactComponent as GoIcon } from './public/go.svg'
import { ReactComponent as HertzIcon } from './public/hertz.svg'
import { ReactComponent as NodejsIcon } from './public/nodejs.svg'
import { ReactComponent as NextjsIcon } from './public/nextjs.svg'
import { ReactComponent as JavaIcon } from './public/java.svg'
import { ReactComponent as PythonIcon } from './public/python.svg'
import { ReactComponent as SpringBootIcon } from './public/spring-boot.svg'
import { ReactComponent as VueIcon } from './public/vue.svg'

const map: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  c: CIcon,
  flask: FlaskIcon,
  gin: GinIcon,
  go: GoIcon,
  hertz: HertzIcon,
  nodejs: NodejsIcon,
  nextjs: NextjsIcon,
  java: JavaIcon,
  python: PythonIcon,
  springBoot: SpringBootIcon,
  vue: VueIcon,
}

const MyIcon = ({ name }: { name: string }) => {
  const IconComponent = map[name]
  return IconComponent ? <IconComponent className="icon" /> : null
}

export default MyIcon
