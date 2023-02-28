import type { Group, Object3D } from 'three';
import { RubikCube } from './components/Cube';
type Cubie = Object3D;

type Face = 'RIGHT' | 'LEFT' | 'UPPER' | 'DOWN' | 'BACK' | 'FRONT';

export const getCubiesByFace = (
  face: Face,
  cubeRef: RubikCube
): Array<Cubie> => {
  switch (face) {
    case 'RIGHT':
      return cubeRef.children.filter((child) => child.position.x === 1);
    case 'LEFT':
      return cubeRef.children.filter((child) => child.position.x === -1);
    case 'UPPER':
      return cubeRef.children.filter((child) => child.position.y === 1);
    case 'DOWN':
      return cubeRef.children.filter((child) => child.position.y === -1);
    case 'FRONT':
      return cubeRef.children.filter((child) => child.position.z === 1);
    case 'BACK':
      return cubeRef.children.filter((child) => child.position.z === -1);
    default:
      return [];
  }
};

export type Move =
  | 'R'
  | "R'"
  | 'L'
  | "L'"
  | 'U'
  | "U'"
  | 'D'
  | "D'"
  | 'F'
  | "F'"
  | 'B'
  | "B'";

export const makeMove = (move: Move, moveGroup: Group, delta: number): void => {
  switch (move) {
    case 'R':
      moveGroup.rotation.x -= delta;
      break;
    case "R'":
      moveGroup.rotation.x += delta;
      break;
    case 'L':
      moveGroup.rotation.x += delta;
      break;
    case "L'":
      moveGroup.rotation.x -= delta;
      break;
    case 'U':
      moveGroup.rotation.z += delta;
      break;
    case "U'":
      moveGroup.rotation.z -= delta;
      break;
    case 'D':
      moveGroup.rotation.z += delta;
      break;
    case "D'":
      moveGroup.rotation.z -= delta;
      break;
    case 'F':
      moveGroup.rotation.y += delta;
      break;
    case "F'":
      moveGroup.rotation.y -= delta;
      break;
    case 'B':
      moveGroup.rotation.y += delta;
      break;
    case "B'":
      moveGroup.rotation.y -= delta;
      break;
  }
};
