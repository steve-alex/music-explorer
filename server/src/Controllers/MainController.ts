import { Router, Request, Response, NextFunction} from 'express';
const url = require('url');
import requestGenerator from 'request';

class MainController {
  public router = Router();
  public clientId = process.env.CLIENT_ID;
  public clientSecret = process.env.CLIENT_SECRET;

  constructor(){
    this.router = Router();
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.get('/items', this.getItems)
  }

  private getItems = async (request: any, response: Response, next: NextFunction) => {
    const authConfig = this.createAuthObject(request.query);

    requestGenerator.get(authConfig, function(error, spotifyResponse) {
      console.log("SpotifyResponse.statusCode", spotifyResponse.statusCode);

      if (!error && spotifyResponse.statusCode === 200) {
        const items = spotifyResponse.body.items;
        response.status(200).send(items);
      } else {
        console.log("Error: ", error);
      }
    });      
  }

  private createAuthObject = (query: any) => {
    var authOptions = {
      url: `https://api.spotify.com/v1/me/top/${query.type}/?time_range=${query.time_range}`,
      headers: {
        'Authorization': `Bearer ${query.access_token}`
      },
      json: true
    };

    return authOptions
  }
}

export default MainController;
