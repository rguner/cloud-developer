
import express, {  Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage/", async ( req: Request, res: Response ) => {
    let { image_url } = req.query;

    if ( !image_url ) {
      return res.status(400)
                .send("image_url is required");
    }

    let filteredImageUrl = await filterImageFromURL(image_url);

    res.sendFile(filteredImageUrl); 
    res.on('finish', function() {
      try {
        let urlsForDelete: string[] = [filteredImageUrl];
        deleteLocalFiles(urlsForDelete);
      } catch(e) {
        console.log("error removing file ", filteredImageUrl); 
      }
    });       

  } );


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();