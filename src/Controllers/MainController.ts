import { Router, Request, Response, NextFunction} from 'express';
import querystring from 'querystring';
const url = require('url');

class MainController {
  public router = Router();

  constructor(){
    this.router = Router();
    this.initializeRoutes();
  }

  public initializeRoutes(){
    this.router.get('/', this.main);
  }

  private main = async (request: any, response: Response, next: NextFunction) => {
    const access_token = request.query.access_token;
    const refresh_token = request.query.refresh_token;
    response.send({ access_token, refresh_token })
  }
}

export default MainController;
