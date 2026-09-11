import express from 'express';
import { serverConfig } from './config/index.ts';
import v1Router from './routes/v1/index.router.ts';
import { appErrorHandler, genericErrorHandler } from './middleware/error.middleware.ts';
import logger from './config/logger.config.ts';
import { attachedCorrelatioIdMiddleware } from './middleware/correlation.middleware.ts';

const app = express();

app.use(express.json());

app.use(attachedCorrelatioIdMiddleware);

app.use('/api/v1', v1Router);


app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT, () => {
    logger.info(`app is running at http://localhost:${serverConfig.PORT}`);
    logger.info("Press ctrl + c for stop the server!", {name: "dev server"});
})
