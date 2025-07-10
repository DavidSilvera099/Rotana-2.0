import './index.css'
import Logo from './assets/Logo-azul.webp'
import LoginTemplate from './components/templates/LoginTemplate'

function App() {

  return (
    <>
      <LoginTemplate logoSrc={Logo} />
    </>
  )
}

export default App
