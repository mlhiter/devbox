import { ChakraProvider } from '@chakra-ui/react'

import Template from './components/Template'

const App = () => {
  return (
    <ChakraProvider>
      <Template />
    </ChakraProvider>
  )
}

export default App
