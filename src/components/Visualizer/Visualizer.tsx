import React from "react";
import { Viewport } from "./viewport";
import "./visualizer.scss";

const Visualizer: React.FC = () => {
  const div = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!div) return;
    const viewport = new Viewport(div.current as HTMLDivElement);
    viewport.CreateCube();
  }, [div]);

  return <div id="visualizer" ref={div}></div>;
};

export default Visualizer;
