import axios, { AxiosResponse } from "axios";
import { failure, success } from "../../utils/response";
import { getRiotAPIKey } from "../../utils/secrets";

export const main = async (event: any = {}, _context) => {
  try {
    const { region, summonerName } = JSON.parse(event.body);

    if (!region || !summonerName) {
      return failure({ error: "Must provide Region and SummonerName" });
    }

    const apiKey = await getRiotAPIKey();
    if (!apiKey) {
      return failure({ error: "Failed to fetch API Key" });
    }

    const url = `https://${region}/lol/summoner/v4/summoners/by-name/${summonerName}`;
    const response: AxiosResponse = await axios.get(url, {
      params: {
        api_key: apiKey,
      },
    });

    if (response.status === 200) {
      return success(response.data);
    } else {
      return failure({
        error: "Riot API Failed",
        response: response.status,
        reason: response.statusText,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
