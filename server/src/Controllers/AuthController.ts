import { Router, Request, Response, NextFunction} from 'express';
require('dotenv').config();
import querystring from 'querystring';
import requestGenerator from 'request';
import generateRandomState from '../Helpers/Helpers';
import url from 'url';

class AuthController {
  public router = Router();
  public stateKey = 'spotify_auth_state';
  public clientId = process.env.CLIENT_ID;
  public clientSecret = process.env.CLIENT_SECRET;
  public redirectUri = process.env.REDIRECT_URI;

  constructor(){
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.get('/login', this.authenticateUser);
    this.router.get('/callback', this.handleRedirect);
    // this.router.get('/refresh_token', this.refreshToken);
  }

  /* *
  * First step in Oauth Process.
  * The application requests authorization from Spotify.
  * User is redirected to Spotify, where they verify themselves.
  * If verification is successful, we are redirected to the /callback route with a code & state
  */
  private authenticateUser = async (request: Request, response: Response, next: NextFunction) => {
    var state = generateRandomState(16);
    response.cookie(this.stateKey, state);
    // TODO -  What is going on here? Are we storing this as a cookie for future access?
    var scope = 'user-top-read';

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    console.log("Iniate redirect to Spotify")
    response.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: this.clientId,
        scope: scope,
        redirect_uri: this.redirectUri,
        state: state
      }));
  }

  /* *
  * Second step in Oauth Process.
  * This is the redirect URL Spotify is given to use when a client successfully verifies.
  * We access a code and state variable and use it to request authorization and refresh tokens
  */
  private handleRedirect = async (request: Request, response: Response, next: NextFunction) => {
    var code = request.query.code || null;
    var state = request.query.state || null;
    var storedState = request.cookies ? request.cookies[this.stateKey] : null;

    console.log("Handle redirect back from Spotify")
    console.log("Code: ", code);
    console.log("State: ", state);

    if (state === null || state !== storedState) {
      this.redirectWithError(response, 'state_mismatch');
    } else {
      try {
        response.clearCookie(this.stateKey);
        const authConfig = this.createAuthorizationCodeAuthObject(code);      
        this.getAuthorizationAccess(authConfig, response);
      } catch (error) {
        console.log(error)
        next()
      }
    }
  }

  /* *
  * Third step in Oauth Process. The server sends a request for a refresh token and an access token..
  * Any requests made by the user to Spotify will include these and will be validated.
  * Collect $200 and go :)
  */
  private getAuthorizationAccess = (authConfig: any, response: Response) => {
    requestGenerator.post(authConfig, function(error, res, body) {
      if (!error && res.statusCode === 200) {
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        console.log("Access Token: ---> ", access_token);
        console.log("Initiate redirect back to home page")

        response.cookie('access_token', access_token);
        response.redirect('http://localhost:3001/home')

        // TODO - If this is a 401, then we need to refresh the token!
      } else {
        throw new Error('Invalid Token')
      }
    })
  }

  // requesting access token from refresh token
  // private refreshToken = (request: Request, response: Response, next: NextFunction) => {
  //   var refresh_token = request.query.refresh_token;

  //   const authConfig = this.generateRefreshAuthConfig(refresh_token);
    
  //   requestGenerator.post(authConfig, function(error, response, body) {
  //     if (!error && response.statusCode === 200) {
  //       var access_token = body.access_token;
  //       response.send({
  //         'access_token': access_token
  //       });
  //     }
  //   });
  // }

  private createAuthorizationCodeAuthObject = (code: any) => {
    //TODO - Move to Auth Helpers
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer(this.clientId + ':' + this.clientSecret).toString('base64'))
      },
      form: {
        code: code,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code'
      },
      json: true
    };

    return authOptions
  }

  private generateRefreshAuthConfig = (refreshToken: any) => {
    //TODO - Move to Auth Helpers
    var authConfig = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(this.clientId + ':' + this.clientSecret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      },
      json: true
    };

    return authConfig;
  }

  private redirectWithError(response: any, error: string){
    //TODO - Move to Auth Helpers
    response.redirect('/#' +
      querystring.stringify({
        error: error
      }));
  }
};

export default AuthController;