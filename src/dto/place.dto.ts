export class Place {
  uuid: string;
  qrcode?: string;
  type: string;
  name: string;
  name_display?: string;
  capacity?: number;
  external_resource_id?: string;
  is_mapped?: boolean;
  created_at?: string;
  updated_at?: string;
  area?: {
    address: string;
    floor: Floor;
    building: Building;
    site: Site;
  };
  sector?: null;
}

class Floor {
  uuid: string;
  name: string;
  is_active: boolean;
}

class Building {
  uuid: string;
  name: string;
  address: string;
  is_active: boolean;
}

class Site {
  uuid: string;
  name: string;
  is_active: boolean;
}
