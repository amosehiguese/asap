import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'

import { Provider } from 'react-redux'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <Provider store={store}>
      <App />
      <Toaster/>
    </Provider>
  </HelmetProvider>
)
