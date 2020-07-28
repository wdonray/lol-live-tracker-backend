import axios, { AxiosResponse } from "axios";
import { failure, success } from "../../utils/response";
import { getRiotAPIKey } from "../../utils/secrets";

export const main = async (event: any = {}, _context) => {
  try {
    const { region, encryptedAccountId } = JSON.parse(event.body);

    if (!encryptedAccountId) {
      return failure({ error: "Must provide Encrypted Account Id" });
    }

    const apiKey = await getRiotAPIKey();
    if (!apiKey) {
      return failure({ error: "Failed to fetch API Key" });
    }

    const url = `https://${region}/lol/match/v4/matchlists/by-account/${encryptedAccountId}`;
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
