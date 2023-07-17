import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

export const RoundedBox = (options?: {
  width?: number;
  height?: number;
  depth?: number;
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
  smoothness?: number;
}) => {
  const width = options?.width || 1;
  const height = options?.height || 1;
  const depth = options?.depth || 1;
  const additionalHeight =
    options?.radius || Math.min(Math.min(width, height), depth) * 0.25;

  const geometry = RoundedBox();
};
