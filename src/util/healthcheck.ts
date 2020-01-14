import logger from "./logger";
import rp from "request-promise";


const START = "START";
const FAIL = "FAIL";
const SUCCESS = "SUCCESS";


const send = async (url: string, type: string, path: string) => {
 if (process.env.NODE_ENV === "production") { 
    logger.info(`---Sending Execution ${type} to Healthcheck.io--------------------------`);
    try { 
      const notificationUrl = `${url}${path}`; 
      logger.info(`Alert ${notificationUrl}`);
      await rp({
        uri: notificationUrl,
        headers: {
            "User-Agent": "Request-Promise"
        },
        resolveWithFullResponse: true       
      }).then(function(response){
          logger.info(`Status: ${response.statusCode}`);
        }
      ); 
    } catch (e) { 
      logger.error(`Alerting Error: ${e}`); 
    }
    logger.info("------------------------------------");
    return;    
  } else {
    return;
  }
};

export const notifyStart = async (url: string) => {
  send(url, START, "/start");
};

export const notifyFail = async (url: string) => {
  send(url, FAIL, "/fail");
};

export const notifySuccess = async (url: string) => {
  send(url, SUCCESS, "");
};



