import type { Group, Object3D } from "three";
import { QueueAction } from "../components/Controls";
import { RubikCube } from "../components/Cube";
type Cubie = Object3D;
type Face = "RIGHT" | "LEFT" | "UPPER" | "DOWN" | "BACK" | "FRONT";

const EPSILON = Number.EPSILON * 10;

export const getCubiesByFace = (
  face: Face,
  cubeRef: RubikCube
): Array<Cubie> => {
  switch (face) {
    case "RIGHT":
      return cubeRef.children.filter(
        (child) =>
          child.position.x >= 1 - EPSILON && child.position.x <= 1 + EPSILON
      );
    case "LEFT":
      return cubeRef.children.filter(
        (child) =>
          child.position.x >= -(1 + EPSILON) && child.position.x <= -1 + EPSILON
      );
    case "UPPER":
      return cubeRef.children.filter(
        (child) =>
          child.position.y >= 1 - EPSILON && child.position.y <= 1 + EPSILON
      );
    case "DOWN":
      return cubeRef.children.filter(
        (child) =>
          child.position.y >= -(1 + EPSILON) && child.position.y <= -1 + EPSILON
      );
    case "FRONT":
      return cubeRef.children.filter(
        (child) =>
          child.position.z >= 1 - EPSILON && child.position.z <= 1 + EPSILON
      );
    case "BACK":
      return cubeRef.children.filter(
        (child) =>
          child.position.z >= -(1 + EPSILON) && child.position.z <= -1 + EPSILON
      );
    default:
      return [];
  }
};

export const getCubiesByMove = (
  move: Move,
  cubeRef: RubikCube
): Array<Cubie> => {
  switch (move) {
    case "R":
      return getCubiesByFace("RIGHT", cubeRef);
    case "R'":
      return getCubiesByFace("RIGHT", cubeRef);
    case "L":
      return getCubiesByFace("LEFT", cubeRef);
    case "L'":
      return getCubiesByFace("LEFT", cubeRef);
    case "U":
      return getCubiesByFace("UPPER", cubeRef);
    case "U'":
      return getCubiesByFace("UPPER", cubeRef);
    case "D":
      return getCubiesByFace("DOWN", cubeRef);
    case "D'":
      return getCubiesByFace("DOWN", cubeRef);
    case "F":
      return getCubiesByFace("FRONT", cubeRef);
    case "F'":
      return getCubiesByFace("FRONT", cubeRef);
    case "B":
      return getCubiesByFace("BACK", cubeRef);
    case "B'":
      return getCubiesByFace("BACK", cubeRef);
    default:
      return cubeRef.children;
  }
};

export type Move =
  | "R"
  | "R'"
  | "L"
  | "L'"
  | "U"
  | "U'"
  | "D"
  | "D'"
  | "F"
  | "F'"
  | "B"
  | "B'"
  | "X"
  | "X'"
  | "Y"
  | "Y'"
  | "Z"
  | "Z'";

export const makeMove = (move: Move, moveGroup: Group, delta: number): void => {
  switch (move) {
    case "R":
      moveGroup.rotation.x -= delta;
      break;
    case "R'":
      moveGroup.rotation.x += delta;
      break;
    case "L":
      moveGroup.rotation.x += delta;
      break;
    case "L'":
      moveGroup.rotation.x -= delta;
      break;
    case "U":
      moveGroup.rotation.y -= delta;
      break;
    case "U'":
      moveGroup.rotation.y += delta;
      break;
    case "D":
      moveGroup.rotation.y += delta;
      break;
    case "D'":
      moveGroup.rotation.y -= delta;
      break;
    case "X":
    case "F":
      moveGroup.rotation.z -= delta;
      break;
    case "X'":
    case "F'":
      moveGroup.rotation.z += delta;
      break;
    case "B":
      moveGroup.rotation.z += delta;
      break;
    case "B'":
      moveGroup.rotation.z -= delta;
      break;
    default:
      break;
  }
};

export const cleanUpMove = (move: Move, moveGroup: Group): void => {
  switch (move) {
    case "R":
      moveGroup.rotation.x = -Math.PI / 2;
      break;
    case "R'":
      moveGroup.rotation.x = Math.PI / 2;
      break;
    case "L":
      moveGroup.rotation.x = Math.PI / 2;
      break;
    case "L'":
      moveGroup.rotation.x = -Math.PI / 2;
      break;
    case "U":
      moveGroup.rotation.y = -Math.PI / 2;
      break;
    case "U'":
      moveGroup.rotation.y = Math.PI / 2;
      break;
    case "D":
      moveGroup.rotation.y = Math.PI / 2;
      break;
    case "D'":
      moveGroup.rotation.y = -Math.PI / 2;
      break;
    case "F":
      moveGroup.rotation.z = -Math.PI / 2;
      break;
    case "F'":
      moveGroup.rotation.z = Math.PI / 2;
      break;
    case "B":
      moveGroup.rotation.z = Math.PI / 2;
      break;
    case "B'":
      moveGroup.rotation.z = -Math.PI / 2;
      break;
    default:
      break;
  }
};

export const createStopCondition = (
  moveGroup: Group,
  move: Move
): (() => boolean) => {
  switch (move) {
    case "R":
      return () => moveGroup.rotation.x <= -Math.PI / 2;
    case "R'":
      return () => moveGroup.rotation.x >= Math.PI / 2;
    case "L":
      return () => moveGroup.rotation.x >= Math.PI / 2;
    case "L'":
      return () => moveGroup.rotation.x <= -Math.PI / 2;
    case "U":
      return () => moveGroup.rotation.y <= -Math.PI / 2;
    case "U'":
      return () => moveGroup.rotation.y >= Math.PI / 2;
    case "D":
      return () => moveGroup.rotation.y >= Math.PI / 2;
    case "D'":
      return () => moveGroup.rotation.y <= -Math.PI / 2;
    case "F":
      return () => moveGroup.rotation.z <= -Math.PI / 2;
    case "F'":
      return () => moveGroup.rotation.z >= Math.PI / 2;
    case "B":
      return () => moveGroup.rotation.z >= Math.PI / 2;
    case "B'":
      return () => moveGroup.rotation.z <= -Math.PI / 2;
    default:
      return () => true;
  }
};

export const addMoveToQueue = (
  cube: RubikCube,
  moveGroup: Group,
  add: (...items: QueueAction[]) => void,
  ...moves: Move[]
): void => {
  add(
    ...moves.map((move) => ({
      move: move,
      initialized: false,
      initializationFn: function () {
        if (this.initialized === false) {
          moveGroup.add(...getCubiesByMove(move, cube));
          this.initialized = true;
        } else {
          this.initialized = false;
        }
      },
      stopCondition: createStopCondition(moveGroup, move)
    }))
  );
};
