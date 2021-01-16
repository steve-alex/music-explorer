const fakeAuth = {
  isAuthenticated: false,
  
  authenticate(cb: any){
    //TODO - make this an effect! -> When the component is created, check if there exists an access token
    // 
    
    this.isAuthenticated = true
    setTimeout(cb, 100)
    //TODO - what happens if this doesn't authenticate? Hmmmm.....
    // Well then is authenticated would be set to false, so even if you try and authenticate
    // Basically. we have to split the callbacka and the setting to isAuthenticated = true!

  },
  signout(cb: any){
    this.isAuthenticated = false
    setTimeout(cb, 100)
    // Easy - wipe out credentials in browser, set this to true.
  }
}

export default fakeAuth;