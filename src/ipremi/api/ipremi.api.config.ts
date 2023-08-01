import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { config } from 'dotenv';

config();
const configService = new ConfigService();
const isLocal = configService.get('NODE_ENV') !== 'production';
const password = configService.get('IPREMI_PASSWORD');
const login = configService.get('IPREMI_LOGIN');
const ipremiEnviroment = isLocal ? 'prototipoapipartner' : 'apipartner';
const baseURL = `https://${ipremiEnviroment}.ipremi.com.br`;
const headers: any = { 'Content-Type': `application/json; charset=UTF-8` };
const token = Buffer.from(`${login}:${password}`).toString('base64');
headers['CampaignID'] = configService.get('IPREMI_CAMPAIGN_ID');
headers['PartnerAccessKey'] = configService.get('IPREMI_PARTNER_ACCESS_KEY');
headers['Authorization'] = `Basic ${token}`;
export const apiIpremi = axios.create({
  baseURL,
  headers,
});
