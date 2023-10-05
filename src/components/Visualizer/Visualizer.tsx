import React from "react";
import { Viewport } from "./viewport";
import { Visualization } from "./visualization";
import "./visualizer.scss";

export class VizStore {
  visualization!: Visualization;
  static instance: VizStore;

  constructor(viz: Visualization) {
    this.visualization = viz;
    VizStore.instance = this;
  }

  public static SetInstance(viz: Visualization) {
    VizStore.instance = new VizStore(viz);
  }

  public static GetInstance() {
    return VizStore.instance;
  }
}

const Visualizer: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref) return;
    const viewport = new Viewport(ref.current as HTMLDivElement);
    const visualization = new Visualization(viewport);
    VizStore.SetInstance(visualization);
  }, [ref]);

  window.addEventListener("resize", () => {
    if (!ref) return;
    VizStore.GetInstance().visualization.vpt.setSize(
      window.innerWidth,
      window.innerHeight
    );
  });

  window.addEventListener("pointermove", (e) => {
    const vizStore = VizStore.GetInstance();
    if (!vizStore) return;

    vizStore.visualization.vpt.OnPointerMove(e);
    vizStore.visualization.PopUp();
  });

  return <div id="visualizer" ref={ref}></div>;
};

export default Visualizer;
