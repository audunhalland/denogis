export type Coordinate = [number, number];

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
  readonly coordinates: Array<Array<Coordinate>>;
}

export function singlePolygon(
  coords: Array<Coordinate>,
): Polygon {
  return {
    type: "Polygon",
    coordinates: [coords],
  };
}
