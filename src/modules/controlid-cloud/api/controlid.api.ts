import { Inject, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import ControlidApiInterface from '../../../interfaces/controlid-api.interface';
import { CONTROLID_CONFIG_OPTIONS } from '../../controlid-on-premise/constants/controlid-options.constant';
import { ControlidOnPremiseDto } from '../../controlid-on-premise/dto/controlid-on-premise-request.dto';
import { PersonDto } from '../dto/person.dto';
import { TLog } from '../dto/log.type';

@Injectable()
export class ApiControlidCloud implements ControlidApiInterface {
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
        config.headers[
          'Authorization'
        ] = `Bearer ${await this.getBearerToken()}`;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );
  }

  async getBearerToken() {
    const apiConfig = this.options?.api;
    const body = {
      email: apiConfig?.user,
      password: apiConfig.password,
    };

    return axios
      .post(`${apiConfig?.host}/operators/login`, body)
      .then((res) => res.data?.data?.token)
      .catch((e) => {
        this.logger.error(`Error to get bearer token ${e?.message}`);
      });
  }

  async getUserPassLogs(): Promise<TLog[]> {
    const url = `/accesslog/logs?page=1&pageSize=50&sortField=Time&sortOrder=desc`;
    return this.api
      .get(url)
      .then((res) => res.data?.data?.data)
      .catch((e) => {
        this.logger.error(`erro to get user pass logs ${e?.message}`);
        return [];
      });
  }

  getDeviceByName(name: string) {
    const url = `/devices?sortField=Name&value=${name}&sortOrder=desc`;
    return this.api.get(url).then((res) => res.data?.data?.data);
  }

  getLastCreatedUsers() {
    return this.api
      .get(`/persons`)
      .then((res) => res.data)
      .catch((e) => {
        this.logger.error(`erro to get last created users ${e?.message}`);

        throw new Error(`erro to get last created users ${e?.message}`);
      });
  }

  async grantAccessToToday(email: string, startDate: Date, endDate: Date) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error(`User not found on Controlid ${email}`);
    }
    const body = {
      personId: user.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    return this.api
      .post(`/persons`, body)
      .then((res) => res.data)
      .catch((e) => {
        this.logger.error(
          `erro to grant access to ${email} on controlId ${e?.message}`,
        );

        throw new Error(
          `erro to grant access to ${email} on controlId ${e?.message}`,
        );
      });
  }

  getUserByEmail(email: string): Promise<PersonDto> {
    const url = `/persons?sortField=Email&value=${email}`;
    return this.api.get(url).then(
      ({
        data: {
          data: { data },
        },
      }) => (data?.length ? data[0] : null),
    );
  }

  getUserByName(name: string): Promise<PersonDto> {
    const url = `/persons?sortField=Name&value=${name}`;
    return this.api.get(url).then(
      ({
        data: {
          data: { data },
        },
      }) => (data?.length ? data[0] : null),
    );
  }

  async revokeUserAccess(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error(`User not found on Controlid ${email}`);
    }
    const apiConfig = this.options?.api;
    const body = {
      personId: user.id,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
    return this.api
      .post(`${apiConfig?.host}/persons`, body)
      .then((res) => res.data)
      .catch((e) => {
        this.logger.error(
          `erro to grant access to ${email} on controlId ${e?.message}`,
        );

        throw new Error(
          `erro to grant access to ${email} on controlId ${e?.message}`,
        );
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
    this.getBearerToken();
    return Promise.all([]);
  }
}
