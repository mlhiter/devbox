import React from 'react'

import CIcon from '../public/c.svg'
import FlaskIcon from '../public/flask.svg'
import GinIcon from '../public/gin.svg'
import GoIcon from '../public/go.svg'
import RustIcon from '../public/rust.svg'
import HertzIcon from '../public/hertz.svg'
import NodejsIcon from '../public/nodejs.svg'
import NextjsIcon from '../public/nextjs.svg'
import JavaIcon from '../public/java.svg'
import PythonIcon from '../public/python.svg'
import SpringBootIcon from '../public/spring-boot.svg'
import VueIcon from '../public/vue.svg'
import UbuntuIcon from '../public/ubuntu.svg'
import DeleteIcon from '../public/info/delete.svg'
import AddIcon from '../public/info/add.svg'
import AttachIcon from '../public/info/attach.svg'
import ArrowLeft from '../public/info/arrow-left.svg'
import DebianIcon from '../public/debian.svg'

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
  rust: RustIcon,
  ubuntu: UbuntuIcon,
  delete: DeleteIcon,
  add: AddIcon,
  attach: AttachIcon,
  arrowLeft: ArrowLeft,
  debian: DebianIcon,
}

const MyIcon = ({ name }: { name: string }) => {
  const IconComponent = map[name]
  return IconComponent ? <IconComponent className="icon" /> : null
}

export default MyIcon
