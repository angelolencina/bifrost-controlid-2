import { Inject, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { IPREMI_CONFIG_OPTIONS } from '../constants/ipremi-options.constant';
import { IpremiDto } from '../dto/ipremi.dto';
import { SendDataDto, SendDataProps } from '../dto/send-data.dto';
import { ParticipantDataDto } from '../dto/participant-data.dto';
import { DoParticipantCreditDataDto } from '../dto/do-participant-credit-data.dto';

@Injectable()
export class ApiIpremi {
  private readonly logger = new Logger('ApiIpremi');
  public api: AxiosInstance;
  static baseUrl = '';
  constructor(@Inject(IPREMI_CONFIG_OPTIONS) private options: IpremiDto) {
    this.init();
  }

  async init() {
    this.logger.log('init ipremi api');
    const apiConfig = this.options;
    const token = Buffer.from(
      `${apiConfig?.login}:${apiConfig?.password}`,
    ).toString('base64');
    this.api = axios.create({
      baseURL: apiConfig?.url,
      headers: {
        'Content-Type': `application/json; charset=UTF-8`,
        CampaignID: apiConfig?.campaignId,
        PartnerAccessKey: apiConfig?.partnerAccessKey,
        Authorization: `Basic ${token}`,
      },
    });
  }

  sendParticipantData(data: SendDataProps): Promise<ParticipantDataDto> {
    return this.api
      .post('/partner/sendParticipantData', data)
      .then((res) => res.data);
  }

  doParticipantCreditRequest(data: DoParticipantCreditDataDto) {
    data.BankAccountID = this.options.bankAccountId;
    return this.api.post('/partner/doParticipantCreditRequest', data);
  }
}
