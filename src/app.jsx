import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { MyRatings } from './account/my-ratings';
import { Database } from './database/database';
import { User } from './user/user';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
  const [username, setUsername] = React.useState(localStorage.getItem('username') || '');
  const currentAuthState = username ? false : true;
  const [authState, setAuthState] = React.useState(currentAuthState);

  return (
    <BrowserRouter>
      <div className='body bg-dark text-light'>
        <header className='container-fluid'>
          <nav className='navbar fixed-top navbar-dark'>
            <div className='navbar-brand'>
              Ratings<sup>&reg;</sup>
            </div>
            <menu className='navbar-nav'>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/'>
                  Login
                </NavLink>
              </li>
              {authState === true && (
                <>
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='/database'>
                      Database
                    </NavLink>
                  </li>
                  <li className='nav-item'>
                    <NavLink className='nav-link' to='/account'>
                      My Ratings
                    </NavLink>
                  </li>
                </>
              )}
              <li className='nav-item'>
                <NavLink className='nav-link' to='/login'>
                  Sign Out
                </NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route
            path='/'
            element={
              <Login
                username={username}
                authState={authState}
                onAuthChange={(username, authState) => {
                  setAuthState(authState);
                  setUsername(username);
                }}
              />
            }
            exact
          />
          <Route path='/login' element={<Login />} />
          <Route path='/user' element={<User />} />
          <Route path='/database' element={<Database />} />
          <Route path='/account' element={<MyRatings />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer className='bg-dark text-light'>
          <div className='container-fluid'>
            <span className='text-reset'>Benjamin Bethers</span>
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