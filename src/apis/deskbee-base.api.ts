import axios from 'axios';
import * as https from 'https';
const baseURL: string = process.env.DESKBEE_API_URL || 'https://api.deskbee.io';
const headers = { 'Content-Type': `application/json; charset=UTF-8` };
export const apiDeskbee = axios.create({
  baseURL,
  headers,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});
type TBody = {
  grant_type: string;
  client_id: string;
  client_secret: string;
  scope: string;
};
export const getBearerToken = (body: TBody) => {
  const config = {
    headers: { 'Content-Type': `application/json; charset=UTF-8` },
  };
  return axios
    .post(`${baseURL}/v1.1/oauth/token`, body, config)
    .then((res) => res.data)
    .catch((e) => {
      throw new Error(`Error get token: ${e.message})`);
    });
};
