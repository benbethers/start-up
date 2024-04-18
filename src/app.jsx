import React, { useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { MyRatings } from './account/my-ratings';
import { Database } from './database/database';
import { User } from './user/user';
import { NewPerson } from './login/new-person';
import { NewRating } from './user/new-rating';
import './app.css';

function App() {
  const [tokenPresent, setTokenPresent] = useState(localStorage.getItem('token') ? true : false);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setTokenPresent(false);
  };

  return (
    <BrowserRouter>
      <div className='body bg-dark text-light'>
        <header className='container-fluid'>
          <img src="./assets/images/StarCluster.png" height="54px" width="54px" alt="Star Cluster" />
          <h1>Ratings</h1>
          <nav className='navbar fixed-top navbar-dark'>
            {tokenPresent && (
              <>
                <div className='nav-item'>
                  <NavLink className='nav-link' to='/simon.benbethers.click'>
                    Simon
                  </NavLink>
                </div>
                <div className='nav-item'>
                  <NavLink className='nav-link' to='/database'>
                    Database
                  </NavLink>
                </div>
                <div className='nav-item'>
                  <NavLink className='nav-link' to='/account'>
                    My Ratings
                  </NavLink>
                </div>
                <div className='nav-item'>
                  <NavLink className='nav-link' to='/' onClick={handleSignOut}>
                    Sign Out
                  </NavLink>
                </div>
              </>
            )}
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/user' element={<User />} />
          <Route path='/database' element={<Database />} />
          <Route path='/account' element={<MyRatings />} />
          <Route path='/rate' element={<NewRating />} />
          <Route path='/new-person' element={<NewPerson />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer className='bg-dark text-light'>
          <div className='container-fluid'>
            <span className='text-reset'>Benjamin Bethers</span>
            <br />
            <a className='text-reset' href='https://github.com/benbethers/start-up'>GitHub</a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;