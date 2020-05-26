export interface FeatureCollection {
  type: "FeatureCollection";
  features: Array<Feature>;
}

export interface Feature {
  type: "Feature";
  geometry: Geometry;
}

export interface Geometry {
  type: "Polygon";
  coordinates: Array<Array<[number, number]>>;
}

export function singlePolygon(
  coords: Array<[number, number]>,
): Geometry {
  return {
    type: "Polygon",
    coordinates: [coords],
  };
}
