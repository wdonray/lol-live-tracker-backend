import axios, { AxiosResponse } from "axios";
import { failure, success } from "../../utils/response";
import { getRiotAPIKey } from "../../utils/secrets";

export const main = async (event: any = {}, _context) => {
  try {
    const { region, encryptedSummonerId } = JSON.parse(event.body);

    if (!region || !encryptedSummonerId) {
      return failure({ error: "Must provide Encrypted Summoner Id and Region" });
    }

    const apiKey = await getRiotAPIKey();
    if (!apiKey) {
      return failure({ error: "Failed to fetch API Key" });
    }

    const url = `https://${region}/lol/league/v4/entries/by-summoner/${encryptedSummonerId}`;
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
