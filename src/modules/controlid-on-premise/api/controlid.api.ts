import { Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import ControlidApiInterface from '../../../interfaces/controlid-api.interface';

export class ApiControlid implements ControlidApiInterface {
  private readonly logger = new Logger('ApiControlid');
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
    const _logger = new Logger('ApiControlid');
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
        _logger.error(`Erro to Get Token Controlid ${e?.message}`);
        throw new Error(`Erro to Get Token Controlid ${e?.message}`);
      });
  };
  createUserQrCode(userId: number) {
    return this.api
      .post(`/qrcode/userqrcode`, userId)
      .then((res) => res.data)
      .catch((e) => {
        this.logger.error(
          `Error when create user qrcode ${userId} on controlId  ${e?.message}`,
        );
      });
  }

  syncUser(userId: number) {
    return this.api.get(`/util/SyncUser/${userId}`).catch((e: any) => {
      this.logger.error(
        `Error when sync user ${userId} on controlId  ${e?.message}`,
      );
    });
  }
  syncAll() {
    return this.api.get(`/util/SyncAll`).catch((e: any) => {
      this.logger.error(
        `Error when sync all users on controlId  ${e?.message}`,
      );
    });
  }
}
