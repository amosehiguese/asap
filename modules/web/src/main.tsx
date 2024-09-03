import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { SocketProvider } from './context/socket'
import App from './App'
import './index.css'

import { Provider } from 'react-redux'
import { store } from './store'
import { TooltipProvider } from './components/ui/tooltip'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <Provider store={store}>
      <TooltipProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </TooltipProvider>
      <Toaster/>
    </Provider>
  </HelmetProvider>
)
