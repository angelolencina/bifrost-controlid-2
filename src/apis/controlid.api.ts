import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import Controlid from '../interfaces/controlid-repository.interface';

export class ApiControlid implements Controlid {
  public api: AxiosInstance;
  static baseUrl: string = process.env.CONTROLID_API || '';
  constructor() {
    this.api = axios.create({
      baseURL: ApiControlid.baseUrl,
      headers: { 'Content-Type': `application/json; charset=UTF-8` },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    this.api.interceptors.request.use(
      async (config) => {
        config.headers['Authorization'] = await ApiControlid.getBearerToken();
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );
  }

  static getBearerToken = () => {
    const body = {
      username: process.env.CONTROLID_API_USER,
      password: process.env.CONTROLID_API_PASSWORD,
    };
    const config = {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    return axios
      .post(`${ApiControlid.baseUrl}/login`, body, config)
      .then((res) => `Bearer ${res.data.accessToken}`)
      .catch((e) => {
        throw new Error(`Error get token controlid ${e?.message}`);
      });
  };
  createUserQrCode(userId: number) {
    return this.api
      .post(`/qrcode/userqrcode`, userId)
      .then((res) => res.data)
      .catch((e) => {
        throw new Error(`createUserQrCode Error ${e?.message}`);
      });
  }

  syncUser(userId: number) {
    return this.api.get(`/util/SyncUser/${userId}`).catch((e: any) => {
      throw new Error(`createUserQrCode Error ${e?.message}`);
    });
  }
  syncAll() {
    return this.api.get(`/util/SyncAll`).catch((e: any) => {
      throw new Error(`createUserQrCode Error ${e?.message}`);
    });
  }
}
