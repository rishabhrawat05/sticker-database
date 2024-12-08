import './App.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
function App() {
  return (
   <Router>
    <Routes>
     <Route path='/' element = {<Login/>} />
     <Route path='/dashboard' element = {<Dashboard/>} />
    </Routes>
   </Router>
  );
}

export default App;
