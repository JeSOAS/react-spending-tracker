import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import './styles.css';

function App() {
  return (
    <BrowserRouter>
		<div className="nav-container">
			<Link to="/dashboard">Dashboard</Link> | 
			<Link to="/journal"> Journal</Link>
		</div>
		<Routes>
			<Route path="/" element={<Navigate replace to="/dashboard" />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/journal" element={<Journal />} />
			<Route path="*" element={<Navigate replace to="/dashboard" />} />
		</Routes>
    </BrowserRouter>
  );
}

export default App;
