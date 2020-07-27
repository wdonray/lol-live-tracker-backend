import axios, { AxiosResponse } from "axios";
import { failure, success } from "../../utils/response";
import {getRiotAPIKey} from "../../utils/secrets";

export const main = async (event: any = {}, _context) => {
  try {
    const { region, summonerName, apiKey } = event.pathParameters;

    if (!region || !summonerName) {
      return failure({ error: "Must provide Region and SummonerName" });
    }

    const apiKey = await getRiotAPIKey();
    if (!apiKey) {
        
    }

  } catch (err) {
    console.log(err);
  }
};
