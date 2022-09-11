import { useSelector } from "react-redux";
import { selectUserBound } from "../../../state/reducers/userBound";
import { GeoJSON } from "react-leaflet";
import { selectBufferedExtents } from "../../../state/reducers/bufferedExtent";

export const Renders = () => {
  const userBound = useSelector(selectUserBound);
  const bufferedExtents = useSelector(selectBufferedExtents);

  return (
    <>
      {userBound.initialized && (
        <GeoJSON data={userBound.data} key={Math.random()} style={{ color: "red" }} />
      )}
      {bufferedExtents.initialized && (
        <GeoJSON data={bufferedExtents.data} key={Math.random()} />
      )}
    </>
  );
};
