import "./styles.css";
import MainMap from "./components/mapping/main/MainMap";
import ProofMap from "./components/mapping/proof/ProofMap";

export default function App() {
  return (
    <div style={{ display: "flex", flexFlow: "nowrap row-reverse" }}>
      <MainMap />
      <ProofMap />
    </div>
  );
}
