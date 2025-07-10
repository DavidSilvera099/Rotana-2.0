import Button from './components/atoms/Button'
import Input from './components/atoms/Input'
import { Image } from '@heroui/react'
import logo from './assets/Logo-azul.webp'
import './index.css'
function App() {

  return (
    <>
      <div className="flex flex-col gap-4 w-1/2">
        <Image src={logo} alt="logo" className="w-1/2" />
        <Input label="Email" type="email" />
        <Input label="Password" type="password" />
        <Button text="Login" type="secondary" />
      </div>
    </>
  )
}

export default App
