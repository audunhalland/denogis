export type Longitude = number;
export type Latitude = number;

export interface FeatureCollection<Props> {
  readonly type: "FeatureCollection";
  readonly features: Array<Feature<Props>>;
}

export interface Feature<Props> {
  readonly type: "Feature";
  readonly geometry: Geometry | null;
  readonly properties: Props;
}

export type Geometry = Polygon;

export interface Polygon {
  readonly type: "Polygon";
  readonly coordinates: Array<Array<[Longitude, Latitude]>>;
}

export function singlePolygon(
  coords: Array<[Longitude, Latitude]>,
): Polygon {
  return {
    type: "Polygon",
    coordinates: [coords],
  };
}
