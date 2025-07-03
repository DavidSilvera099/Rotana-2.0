import './index.css'
import {Button} from "@heroui/button";
import {Link} from "@heroui/link";
function App() {

  return (
    <>
      <div className='flex flex-col items-center justify-center h-screen'>
      <Link isExternal showAnchorIcon href="https://github.com/heroui-inc/heroui">
        External Link test
      </Link>
      </div>
    </>
  )
}

export default App
