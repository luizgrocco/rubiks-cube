# Rubik's Cube 🧩

An interactive 3D Rubik's Cube you can turn from your keyboard, built as a **Three.js learning project**.

> This repo exists to explore Three.js — meshes, groups, quaternions, animation loops, and camera controls — through the classic problem of animating cube face turns. It's a playground, not a polished product, so expect a few `TODO`s and some rough edges in the code.

## What it's for

The goal was to learn how to:

- Render and light a 3D scene with **Three.js** via **React Three Fiber**
- Group and re-parent meshes (`THREE.Group`) to rotate a single face without disturbing the rest of the cube
- Animate rotations smoothly over time inside a render loop (`useFrame`) with a configurable speed
- Queue moves so turns play back one after another
- Constrain an orbiting camera with `OrbitControls`

## Tech stack

| Purpose        | Library                    |
| -------------- | -------------------------- |
| 3D rendering   | [Three.js](https://threejs.org) |
| React renderer | [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) |
| Helpers/camera | [@react-three/drei](https://github.com/pmndrs/drei) |
| Debug panel    | [leva](https://github.com/pmndrs/leva) |
| State          | [zustand](https://github.com/pmndrs/zustand) |
| Hotkeys        | [react-hotkeys-hook](https://github.com/JohannesKlauss/react-hotkeys-hook) |

## Getting started

```bash
pnpm install
pnpm dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

Other scripts:

```bash
pnpm build     # type-check + production build
pnpm preview   # preview the production build
```

## Keybinds

Moves use standard Rubik's Cube notation. Each key enqueues one **face turn** (clockwise). Hold **Shift** for the **counter-clockwise** (prime `'`) variant.

### Face turns

| Key       | Move  | Face                     |
| --------- | ----- | ------------------------ |
| `Q`       | F     | Front clockwise          |
| `Shift+Q` | F'    | Front counter-clockwise  |
| `E`       | B     | Back clockwise           |
| `Shift+E` | B'    | Back counter-clockwise   |
| `W`       | U     | Up clockwise             |
| `Shift+W` | U'    | Up counter-clockwise     |
| `S`       | D     | Down clockwise           |
| `Shift+S` | D'    | Down counter-clockwise   |
| `A`       | L     | Left clockwise           |
| `Shift+A` | L'    | Left counter-clockwise   |
| `D`       | R     | Right clockwise          |
| `Shift+D` | R'    | Right counter-clockwise  |

### Whole-cube rotations

| Key       | Move  | Rotation                       |
| --------- | ----- | ------------------------------ |
| `1`       | X     | Rotate whole cube around X     |
| `Shift+1` | X'    | Rotate around X (reverse)      |
| `2`       | Y     | Rotate whole cube around Y     |
| `Shift+2` | Y'    | Rotate around Y (reverse)      |
| `3`       | Z     | Rotate whole cube around Z     |
| `Shift+3` | Z'    | Rotate around Z (reverse)      |

Queued moves are shown at the top of the screen; the `^` marks the move currently animating.

## Mouse & debug panel

- **Drag** to orbit the camera (rotation is clamped to a comfortable range).
- **Scroll** to zoom.
- The **leva** panel (top-right) lets you:
  - Rotate the whole cube on X / Y / Z with sliders
  - **Scramble** — enqueue a random scramble and watch it animate
  - **Instant Scramble** — apply a scramble with no animation
  - **Speed (ms)** — animation duration per move
  - **Reset** — clear the queue and return the cube to solved

## How a move works

The tricky part of a Rubik's Cube in 3D is that turning one face has to rotate exactly the nine cubies on that face and nothing else. The approach here:

1. Find the cubies belonging to the requested move (`getCubiesByMove`).
2. Re-parent them into a temporary `THREE.Group` (`moveGroup`).
3. Rotate that group toward 90° a little each frame in `useFrame`, easing on the configured speed.
4. Once the turn completes, snap the angle, re-attach the cubies to the cube (`cube.attach` preserves world transform), and reset the group.

Reading `src/components/Controls.tsx` alongside `src/helpers/utils.ts` is the best way to see the Three.js concepts in action.

## Project layout

```
src/
  components/
    Scene.tsx        # Canvas, lights, camera
    Cube.tsx         # Builds the 3x3x3 cube from cubies
    Cubie.tsx        # A single small cube
    Controls.tsx     # Keybinds, leva panel, move animation loop
    ControlsUI.tsx   # On-screen move queue display
    Floor.tsx
  helpers/
    utils.ts         # Move logic, scramble generation
    hooks.ts         # useQueue
  store/
    zustand.ts       # Shared move-queue state
```
