import React from "react";
import API from './Api';

const redirectToSpotify = () => {
  API.initiateAuthFlow();
}

const WelcomePage = () => {
  return (
    <div>
      <button onClick={() => redirectToSpotify()}>Log In With Spotify</button>
    </div>
  )
}

export default WelcomePage;
