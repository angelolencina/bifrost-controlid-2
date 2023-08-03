export enum EPlace {
  dininghall = 'dininghall',
  meetingroom = 'meetingroom',
  locker = 'locker',
}
export interface ISettings {
  inHomologation: boolean;
  mailsOnHomologation?: string[];
  activePlaces: string[];
}
