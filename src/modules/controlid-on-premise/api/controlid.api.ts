import { Inject, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import ControlidApiInterface from '../../../interfaces/controlid-api.interface';
import { CONTROLID_CONFIG_OPTIONS } from '../constants/controlid-options.constant';
import { ControlidOnPremiseDto } from '../dto/controlid-on-premise-request.dto';

@Injectable()
export class ApiControlid implements ControlidApiInterface {
  private readonly logger = new Logger('ApiControlid');
  public api: AxiosInstance;
  static baseUrl = '';
  constructor(
    @Inject(CONTROLID_CONFIG_OPTIONS) private options: ControlidOnPremiseDto,
  ) {
    this.init();
  }

  async init() {
    const apiConfig = this.options?.api;
    this.api = axios.create({
      baseURL: apiConfig?.host,
      headers: { 'Content-Type': `application/json; charset=UTF-8` },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    this.api.interceptors.request.use(
      async (config) => {
        config.headers['Authorization'] = await this.getToken();
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );
  }

  getToken() {
    const apiConfig = this.options?.api;
    const body = {
      username: apiConfig?.user,
      password: apiConfig.password,
    };
    const config = {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    return axios
      .post(`${apiConfig?.host}/login`, body, config)
      .then((res) => `Bearer ${res.data.accessToken}`)
      .catch((e) => {
        this.logger.error(`Erro to Get Token Controlid ${e?.message}`);
        throw new Error(`Erro to Get Token Controlid ${e?.message}`);
      });
  }

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
    this.logger.log(`Sync all users on controlId`);
    return this.api.get(`/util/SyncAll`).catch((e: any) => {
      this.logger.error(
        `Error when sync all users on controlId  ${e?.message}`,
      );
    });
  }
}
