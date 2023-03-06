import { useQueueStore } from "../store/zustand";

const ControlsUI = () => {
  const { moveQueue } = useQueueStore();

  const size = moveQueue.length;

  return (
    <div
      style={{
        display: "flex",
        zIndex: 10,
        left: "50%",
        top: "3%",
        translate: "-50%",
        position: "fixed",
        fontSize: "50px",
        color: "white",
        fontWeight: "bold",
        gap: 10,
        textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
      }}>
      [{size === 0 && <div style={{ margin: "14px" }} />}
      {moveQueue.slice(0, 1).map((move, index) => (
        <div
          key={`${move}-${index}`}
          style={{ display: "flex", flexDirection: "column" }}>
          <div>{move.move}</div>
          <div>^</div>
        </div>
      ))}
      {moveQueue.slice(1, 5).map((move, index) => (
        <div key={`${move}-${index}`}>{move.move}</div>
      ))}
      {size > 5 && <div>...</div>}]
    </div>
  );
};

export default ControlsUI;
