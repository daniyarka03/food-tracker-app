import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="main-nav">
      <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
        Питание
      </NavLink>
      <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Аналитика
      </NavLink>
      <NavLink to="/new" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Добавить
      </NavLink>
    </nav>
  );
}

export default Navigation;