import {BrowserRouter} from 'react-router-dom'
import RoutesApp from './routes';
import AuthProvider from './contexts/auth';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer/>
        <RoutesApp/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
