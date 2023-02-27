import { Thumbs } from './thumbs.dto';

export class Person {
  uuid: string;
  name: string;
  name_display: string;
  email: string;
  enrollment: null;
  created_at: string;
  updated_at: string;
  image: {
    uuid: string;
    url: string;
    thumbs: Thumbs;
  };
  documents: [];
}
