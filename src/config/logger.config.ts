import winston from "winston";
import { getCorrelationId } from "../utils/helpers/request.helper.ts";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: "DD-MM-YYYY HH-mm-ss" }), // how does the timestamp should be formatted or look like.
        winston.format.json(), // how does the log message should be formatted or look like.
        // defining the custom print format (arrangement of logging information)
        winston.format.printf(({ level, message, timestamp, ...data }) => {
            const output = { level, message, timestamp, correlationId: getCorrelationId(), data };
            return JSON.stringify(output);
        })
    ),
    // if we don't added a transport then the timestamp is not shown
    // a transport defines where our logs should go.
    transports: [
        new winston.transports.Console(), // for printing in our terminal
        new DailyRotateFile({
            filename: "logs/application-%DATE%.log",
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m', // maximum size of a log file
            maxFiles: '14d' // maximum no. of log files to keep
        })
    ]
})


export default logger;