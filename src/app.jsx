import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { MyRatings } from './account/my-ratings';
import { Database } from './database/database';
import { User } from './user/user';
import './app.css';

function App() {
  const [username, setUsername] = React.useState(localStorage.getItem('username') || '');
  const currentAuthState = username ? false : true;
  const [authState, setAuthState] = React.useState(currentAuthState);

  return (
    <BrowserRouter>
      <div className='body bg-dark text-light'>
        <header className='container-fluid'>
        <img src="./assets/images/StarCluster.png" height="54px" width="54px"></img>
          <h1>Ratings</h1>
          <nav className='navbar fixed-top navbar-dark'>
              <div className='nav-item'>
                <NavLink className='nav-link' to='/'>
                  Login
                </NavLink>
              </div>
              {authState === true && (
                <>
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
                </>
              )}
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
                  setAuthState(false);
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