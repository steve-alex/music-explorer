import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  Redirect,
} from "react-router-dom"
import WelcomePage from './WelcomePage';
import HomePage from './HomePage';
import Cookies from 'js-cookie';
import './App.css';

const App: React.FC = () => {
  const history = useHistory();

  return (
    <Router>
      <Route path="/welcome">
        <WelcomePage />
      </Route>

      <Route path="/home" render={(props) => { 
        
        console.log(Cookies.get('Something'));
        // console.log("Access token from url: ", access_token);
        console.log("Access token from cookie: ", Cookies.get('access_token'));
        
        const access_token = Cookies.get('access_token');

        if (access_token){
          return (
            <HomePage access_token={access_token}/>
          )
        } else {
          return <Redirect to={
            {
              pathname: "/welcome",
              state: {
                from: props.location
              }
            }
          }/>
        }
      }}/>

      <Route path ="/" />
    </Router>
  );
}

export default App
