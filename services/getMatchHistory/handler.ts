import axios, { AxiosResponse } from "axios";
import { failure, success } from "../../utils/response";
import { getRiotAPIKey } from "../../utils/secrets";
import { AnyMxRecord } from "dns";

export const main = async (event: any = {}, _context) => {
  try {
    const { region, encryptedAccountId, beginIndex, endIndex } = JSON.parse(event.body);

    if (!region || !encryptedAccountId || !endIndex || !beginIndex) {
      return failure({
        error: "Must provide Encrypted Account Id, Region, End Index and Begin Index",
      });
    }

    const apiKey = await getRiotAPIKey();
    if (!apiKey) {
      return failure({ error: "Failed to fetch API Key" });
    }

    const url = `https://${region}/lol/match/v4/matchlists/by-account/${encryptedAccountId}`;
    const response: AxiosResponse = await axios.get(url, {
      params: {
        api_key: apiKey,
        endIndex: endIndex,
        beginIndex: beginIndex
      },
    });
    const matches: Array<AnyMxRecord> = [];

    if (response.status === 200) {
      const urls: Array<any> = [];
      response.data.matches.forEach((match: any) => {
        urls.push(
          axios.get(`https://${region}/lol/match/v4/matches/${match.gameId}`, {
            params: {
              api_key: apiKey,
            },
          })
        );
      });
      await axios
        .all(urls)
        .then(
          axios.spread((...responses) => {
            responses.forEach((matchData: any) => {
              matches.push(matchData.data);
            });
          })
        )
        .catch((err) => {
          return failure({
            error: "Riot API Failed",
            response: err,
          });
        });
      return success(matches);
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
