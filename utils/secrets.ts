import * as AWS from "aws-sdk";

const ssmClient = new AWS.SecretsManager({ region: "us-east-1" });

export const getRiotAPIKey = async () => {
  try {
    const resp = ssmClient.getSecretValue({ SecretId: "RiotApiKey" }).promise();
    const key = (await resp).SecretString;
    return JSON.parse(key)["RiotApiKey"];
  } catch (err) {
    console.log(err);
  }
};
