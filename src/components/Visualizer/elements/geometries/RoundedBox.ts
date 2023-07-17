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
  const radius =
    options?.radius || Math.min(Math.min(width, height), depth) * 0.25;
  const widthSegments = Math.floor(options?.widthSegments || 1);
  const heightSegments = Math.floor(options?.heightSegments || 1);
  const depthSegments = Math.floor(options?.depthSegments || 1);
  const smoothness = Math.max(3, Math.floor(options?.smoothness || 3));

  let halfWidth = width * 0.5 - radius;
  let halfHeight = height * 0.5 - radius;
  let halfDepth = depth * 0.5 - radius;

  const roundedBox = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];

  const cornerTopGeom = new THREE.SphereGeometry(
    radius,
    smoothness,
    smoothness,
    0,
    Math.PI / 2,
    0,
    Math.PI / 2
  );

  const TLFcorner = cornerTopGeom.clone();
  TLFcorner.translate(-halfWidth, halfHeight, halfDepth);
  geometries.push(TLFcorner);

  const TLBcorner = cornerTopGeom.clone();
  TLBcorner.rotateY(-Math.PI / 2);
  TLBcorner.translate(-halfWidth, halfHeight, -halfDepth);
  geometries.push(TLBcorner);

  const TRBcorner = cornerTopGeom.clone();
  TRBcorner.rotateY(Math.PI / 2);
  TRBcorner.translate(halfWidth, halfHeight, halfDepth);
  geometries.push(TRBcorner);

  const TRFcorner = cornerTopGeom.clone();
  TRFcorner.rotateY(Math.PI);
  TRFcorner.translate(halfWidth, halfHeight, -halfDepth);
  geometries.push(TRFcorner);

  const cornerBottomGeom = new THREE.SphereGeometry(
    radius,
    smoothness,
    smoothness,
    0,
    Math.PI / 2,
    Math.PI / 2,
    Math.PI / 2
  );

  const BLFcorner = cornerBottomGeom.clone();
  BLFcorner.translate(-halfWidth, -halfHeight, halfDepth);
  geometries.push(BLFcorner);

  const BLBcorner = cornerBottomGeom.clone();
  BLBcorner.rotateY(-Math.PI / 2);
  BLBcorner.translate(-halfWidth, -halfHeight, -halfDepth);
  geometries.push(BLBcorner);

  const BRBcorner = cornerBottomGeom.clone();
  BRBcorner.rotateY(Math.PI / 2);
  BRBcorner.translate(halfWidth, -halfHeight, halfDepth);
  geometries.push(BRBcorner);

  const BRFcorner = cornerBottomGeom.clone();
  BRFcorner.rotateY(Math.PI);
  BRFcorner.translate(halfWidth, -halfHeight, -halfDepth);
  geometries.push(BRFcorner);

  const verticalEdgeGeom = new THREE.CylinderGeometry(
    radius,
    radius,
    height - 2 * radius,
    smoothness,
    heightSegments,
    true,
    (Math.PI * 3) / 2,
    Math.PI / 2
  );

  const LFedge = verticalEdgeGeom.clone();
  LFedge.translate(-halfWidth, 0, halfDepth);
  geometries.push(LFedge);

  const LBedge = verticalEdgeGeom.clone();
  LBedge.rotateY(-Math.PI / 2);
  LBedge.translate(-halfWidth, 0, -halfDepth);
  geometries.push(LBedge);

  const RFedge = verticalEdgeGeom.clone();
  RFedge.rotateY(Math.PI / 2);
  RFedge.translate(halfWidth, 0, halfDepth);
  geometries.push(RFedge);

  const RBedge = verticalEdgeGeom.clone();
  RBedge.rotateY(Math.PI);
  RBedge.translate(halfWidth, 0, -halfDepth);
  geometries.push(RBedge);

  const widthEdgeGeom = new THREE.CylinderGeometry(
    radius,
    radius,
    width - 2 * radius,
    smoothness,
    widthSegments,
    true,
    0,
    Math.PI / 2
  );
  widthEdgeGeom.rotateZ(Math.PI / 2);

  const TFedge = widthEdgeGeom.clone();
  TFedge.translate(0, halfHeight, halfDepth);
  geometries.push(TFedge);

  const TBedge = widthEdgeGeom.clone();
  TBedge.rotateY(Math.PI);
  TBedge.translate(0, halfHeight, -halfDepth);
  geometries.push(TBedge);

  const BFedge = widthEdgeGeom.clone();
  BFedge.rotateY(Math.PI).rotateX(Math.PI);
  BFedge.translate(0, -halfHeight, halfDepth);
  geometries.push(BFedge);

  const BBedge = widthEdgeGeom.clone();
  BBedge.rotateY(Math.PI).rotateX(-Math.PI / 2);
  BBedge.translate(0, -halfHeight, -halfDepth);
  geometries.push(BBedge);

  const depthEdgeGeom = new THREE.CylinderGeometry(
    radius,
    radius,
    depth - 2 * radius,
    smoothness,
    depthSegments,
    true,
    Math.PI,
    Math.PI / 2
  );
  depthEdgeGeom.rotateX(Math.PI / 2);

  const TLedge = depthEdgeGeom.clone();
  TLedge.translate(-halfWidth, halfHeight, 0);
  geometries.push(TLedge);

  const TRedge = depthEdgeGeom.clone();
  TRedge.rotateY(Math.PI);
  TRedge.translate(halfWidth, halfHeight, 0);
  geometries.push(TRedge);

  const BLedge = depthEdgeGeom.clone();
  BLedge.rotateY(Math.PI).rotateZ(Math.PI);
  BLedge.translate(-halfWidth, -halfHeight, 0);
  geometries.push(BLedge);

  const BRedge = depthEdgeGeom.clone();
  BRedge.rotateY(Math.PI).rotateZ(-Math.PI / 2);
  BRedge.translate(halfWidth, -halfHeight, 0);
  geometries.push(BRedge);

  const WDfaceGeom = new THREE.PlaneGeometry(
    width - 2 * radius,
    depth - 2 * radius,
    widthSegments,
    depthSegments
  );
  WDfaceGeom.rotateX(-Math.PI / 2);

  const Tface = WDfaceGeom.clone();
  Tface.translate(0, halfHeight + radius, 0);
  geometries.push(Tface);

  const Boface = WDfaceGeom.clone();
  Boface.rotateY(Math.PI).rotateX(Math.PI);
  Boface.translate(0, -halfHeight - radius, 0);
  geometries.push(Boface);

  const HWfaceGeom = new THREE.PlaneGeometry(
    width - 2 * radius,
    height - 2 * radius,
    widthSegments,
    heightSegments
  );

  const Fface = HWfaceGeom.clone();
  Fface.translate(0, 0, halfDepth + radius);
  geometries.push(Fface);

  const Baface = HWfaceGeom.clone();
  Baface.rotateY(Math.PI).rotateZ(Math.PI);
  Baface.translate(0, 0, -halfDepth - radius);
  geometries.push(Baface);

  const HDfaceGeom = new THREE.PlaneGeometry(
    depth - 2 * radius,
    height - 2 * radius,
    depthSegments,
    heightSegments
  );
  HDfaceGeom.rotateY(-Math.PI / 2);

  const Lface = HDfaceGeom.clone();
  Lface.translate(-halfWidth - radius, 0, 0);
  geometries.push(Lface);

  const Rface = HDfaceGeom.clone();
  Rface.rotateY(Math.PI);
  Rface.translate(halfWidth + radius, 0, 0);
  geometries.push(Rface);

  const mergedGeom = BufferGeometryUtils.mergeGeometries(geometries);

  return mergedGeom;
};
