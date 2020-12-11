import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import MainController from './Controllers/MainController';
import AuthController from './Controllers/AuthController';

class App {
  public port: number;
  public app: express.Application;

  constructor(port: number){
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initiatilzeControllers();
  }

  public listen(){
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    })
  }

  private initializeMiddlewares() {
    this.app.use(express.static(__dirname + '/public'))
    this.app.use(express.json());
    this.app.use(cors())
    this.app.use(cookieParser());
  }

  private initiatilzeControllers(){
    this.app.use(new MainController().router);
    this.app.use(new AuthController().router);
  }
}

export default App;
