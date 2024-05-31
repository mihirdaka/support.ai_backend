require('dotenv/config');


import 'reflect-metadata';
import { createConnection,DataSource, LoggerOptions } from 'typeorm';
import logger from './configs/logger.config';
import app from './configs/express.config';
import { dataSource } from './configs/orm.config';


const PORT = process.env.PORT || 5000;

//comment
dataSource
  .initialize()
  .then(() => {
    const connect = async () => {
      try {
        // await dataSource.connect();
  
        // const connection = await createConnection(); // Connect to the DB that is setup in the ormconfig.js
        await dataSource.runMigrations(); // Run all migrations
        logger.info('Connect to database successfully');
        app.listen(PORT, () => {
          logger.info(`Server running at ${PORT}`);
        });
      } catch (e) {
        logger.info(`The connection to database was failed with error: ${e}`);
      }
    }
    connect();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })


