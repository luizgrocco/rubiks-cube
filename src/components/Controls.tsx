import { useFrame, useThree } from "@react-three/fiber";
import { useControls, button } from "leva";
import { useEffect, useMemo, useRef } from "react";
import { Group } from "three";
import { useHotkeys } from "react-hotkeys-hook";
import {
  addMoveToQueue,
  cleanUpMove,
  generateTNoodleScramble,
  getCubiesByMove,
  makeMove,
  Move
} from "../helpers/utils";
import { RubikCube } from "./Cube";
import { useQueue } from "../helpers/hooks";
import { useQueueStore } from "../store/zustand";
import { Billboard, Html, OrbitControls, Text3D } from "@react-three/drei";
import * as THREE from "three";
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";

export interface MoveAction {
  move: Move;
  initialized: boolean;
  initializationFn: () => void;
  stopCondition: () => boolean;
}

interface ControlsProps {
  // cubeRef: RefObject<RubikCube>;
  position: [x: number, y: number, z: number];
  cube: RubikCube;
}

const moveGroup = new Group();

const ROTATION_LIMITS = {
  MIN_AZIMUTH_ANGLE: -Math.PI / 4,
  MAX_AZIMUTH_ANGLE: Math.PI / 4,
  MIN_POLAR_ANGLE: Math.PI / 3,
  MAX_POLAR_ANGLE: Math.PI / 1.5
};

const Controls = ({ position, cube }: ControlsProps) => {
  const { scene } = useThree();
  const { updateMoveQueue } = useQueueStore();
  const previousTime = useRef(0);

  useEffect(() => {
    moveGroup.position.set(...position);
    scene.add(moveGroup);

    return () => {
      scene.remove(moveGroup);
    };
  }, [position, scene]);

  const {
    enqueue,
    dequeue,
    first: currentMove,
    clear: clearQueue,
    size: queueSize,
    queue
  } = useQueue<MoveAction>();

  // This is duplicated state just for the UI, bad design
  useEffect(() => {
    updateMoveQueue([...queue]);
  }, [queue, updateMoveQueue]);

  const isThereAMoveToExecute = useMemo(() => queueSize > 0, [queueSize]);

  const [{ animationSpeed }] = useControls(() => ({
    rotateX: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateX) => {
        cube.rotation.x = (rotateX * Math.PI) / 180;
      },
      label: "Rotate X"
    },
    rotateY: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateY) => {
        cube.rotation.y = (rotateY * Math.PI) / 180;
      },
      label: "Rotate Y"
    },
    rotateZ: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateZ) => {
        cube.rotation.z = (rotateZ * Math.PI) / 180;
      },
      label: "Rotate Z"
    },
    Scramble: button(() => {
      const moves = generateTNoodleScramble();
      console.log(moves);
      moves.forEach((move) => addMoveToQueue(cube, moveGroup, enqueue, move));
    }),
    "Instant Scramble": button(() => {
      // TODO: you were debugging this
      const moves = generateTNoodleScramble();
      console.log(moves);
      moves.forEach((move) => {
        const cubies = getCubiesByMove(move, cube);
        moveGroup.add(...cubies);
        makeMove(move, moveGroup, Math.PI / 2);
        cleanUpMove(move, moveGroup);
        const newChildren = [...moveGroup.children];
        newChildren.forEach((child) => cube.attach(child));
        moveGroup.rotation.set(0, 0, 0);
      });
    }),
    animationSpeed: {
      value: 200,
      min: 0,
      max: 3000,
      step: 10,
      label: "Speed (ms)"
    },
    Reset: button(() => {
      clearQueue();

      moveGroup.rotation.set(0, 0, 0);
      // moveGroup.position.set(...position); // This is not needed because the moveGroup position is never changed in this example

      if (moveGroup.children.length > 0) {
        cube.add(...moveGroup.children);
      }

      cube.rotation.set(0, 0, 0);
      // cube.position.set(...position); // This is not needed because the cube position is never changed in this example
      cube.children.forEach((child) => child.rotation.set(0, 0, 0));
    })
  }));

  useHotkeys("1", () => addMoveToQueue(cube, moveGroup, enqueue, "X"));
  useHotkeys("shift+1", () => addMoveToQueue(cube, moveGroup, enqueue, "X'"));
  useHotkeys("2", () => addMoveToQueue(cube, moveGroup, enqueue, "Y"));
  useHotkeys("shift+2", () => addMoveToQueue(cube, moveGroup, enqueue, "Y'"));
  useHotkeys("3", () => addMoveToQueue(cube, moveGroup, enqueue, "Z"));
  useHotkeys("shift+3", () => addMoveToQueue(cube, moveGroup, enqueue, "Z'"));
  useHotkeys("d", () => addMoveToQueue(cube, moveGroup, enqueue, "R"));
  useHotkeys("shift+d", () => addMoveToQueue(cube, moveGroup, enqueue, "R'"));
  useHotkeys("a", () => addMoveToQueue(cube, moveGroup, enqueue, "L"));
  useHotkeys("shift+a", () => addMoveToQueue(cube, moveGroup, enqueue, "L'"));
  useHotkeys("w", () => addMoveToQueue(cube, moveGroup, enqueue, "U"));
  useHotkeys("shift+w", () => addMoveToQueue(cube, moveGroup, enqueue, "U'"));
  useHotkeys("s", () => addMoveToQueue(cube, moveGroup, enqueue, "D"));
  useHotkeys("shift+s", () => addMoveToQueue(cube, moveGroup, enqueue, "D'"));
  useHotkeys("q", () => addMoveToQueue(cube, moveGroup, enqueue, "F"));
  useHotkeys("shift+q", () => addMoveToQueue(cube, moveGroup, enqueue, "F'"));
  useHotkeys("e", () => addMoveToQueue(cube, moveGroup, enqueue, "B"));
  useHotkeys("shift+e", () => addMoveToQueue(cube, moveGroup, enqueue, "B'"));

  useFrame((state) => {
    if (isThereAMoveToExecute) {
      if (!currentMove.initialized) {
        currentMove.initializationFn();
        previousTime.current = state.clock.elapsedTime;
      }

      if (!currentMove.stopCondition()) {
        const currentTime = state.clock.elapsedTime;
        const deltaTime = currentTime - previousTime.current;
        previousTime.current = currentTime;

        const animationSpeedInSeconds = animationSpeed / 1000;
        const animationSpeedPercentage =
          animationSpeed === 0 ? Infinity : deltaTime / animationSpeedInSeconds;

        const clampedDeltaRadians =
          Math.min(Math.max(animationSpeedPercentage, 0), 1) * (Math.PI / 2);

        makeMove(currentMove.move, moveGroup, clampedDeltaRadians);
      }

      if (currentMove.stopCondition()) {
        cleanUpMove(currentMove.move, moveGroup);
        const newChildren = [...moveGroup.children];
        newChildren.forEach((child) => cube.attach(child));
        moveGroup.rotation.set(0, 0, 0);
        dequeue();
      }
    }
  });

  const letterMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: "#007BFF"
    });
  }, []);

  return (
    <>
      <OrbitControls
        // Panning
        enablePan={false}
        // Rotation
        enableRotate
        minAzimuthAngle={ROTATION_LIMITS.MIN_AZIMUTH_ANGLE}
        maxAzimuthAngle={ROTATION_LIMITS.MAX_AZIMUTH_ANGLE}
        minPolarAngle={ROTATION_LIMITS.MIN_POLAR_ANGLE}
        maxPolarAngle={ROTATION_LIMITS.MAX_POLAR_ANGLE}
        // Zoom
        enableZoom
        minDistance={5}
        maxDistance={20}
        // Use inertia for spring-back effect
        rotateSpeed={0.5} // Adjust for how fast the rotation occurs
      />
      {/* <Billboard
        position={[2, -0.5, 0.5]}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false} // Lock the rotation on the z axis (default=false)
      ></Billboard> */}
      <Text3D
        font={helvetiker}
        material={letterMaterial}
        position={[2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={0.7}>
        D
      </Text3D>
      <Text3D
        font={helvetiker}
        material={letterMaterial}
        position={[0, 0, 2]}
        rotation={[0, 0, 0]}
        size={0.7}>
        F
      </Text3D>
      <Text3D
        font={helvetiker}
        material={letterMaterial}
        position={[0, 2, 0]}
        rotation={[0, 0, 0]}
        size={0.7}>
        W
      </Text3D>
    </>
  );
};

export default Controls;
