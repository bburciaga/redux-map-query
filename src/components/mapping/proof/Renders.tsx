import { useSelector } from "react-redux";
import { selectUserBound } from "../../../state/reducers/userBound";
import { GeoJSON } from "react-leaflet";

export const Renders = () => {
  const { data } = useSelector(selectUserBound);

  return (
    <>
      {data && (
        <GeoJSON data={data} key={Math.random()} style={{ color: "red" }} />
      )}
    </>
  );
};
