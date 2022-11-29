export interface Plane {
    icao24: string;
    callsign: string;
    origin_country: string;
    time_position: number;
    last_contact: number;
    longitude?: number;
    latitude?: number;
    baro_altitude?: number;
    on_ground: boolean;
    velocity?: number;
    true_track?: number;
    vertical_rate?: number;
    sensors?: number[];
    geo_altitude?: number;
    squawk?:number;
    spi: boolean;
    position_source: number
}

export interface States {
    time: string,
    planes: Plane[]
}

export interface QueryParams {
    lat?: string;
    lon?: string;
    range?: string
}