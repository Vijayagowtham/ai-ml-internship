import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LogOut, Hexagon } from 'lucide-react';
import { AuthContext } from '../store/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useContext(AuthContext);

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-logo">
                <Hexagon size={28} /> TaskFlow
            </div>
            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                    <LayoutDashboard size={20} /> Dashboard
                </NavLink>
                <NavLink to="/tasks" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <CheckSquare size={20} /> My Tasks
                </NavLink>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <button className="nav-link" onClick={logout} style={{ width: '100%' }}>
                    <LogOut size={20} /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
