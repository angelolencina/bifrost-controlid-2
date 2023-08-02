export enum EPlace {
  dininghall = 'dininghall',
  meetingroom = 'meetingroom',
  locker = 'locker',
}
export interface ISettings {
  in_homologation: boolean;
  mails_on_homologation?: string[];
  places_active: string[];
}
