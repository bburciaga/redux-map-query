import { useSelector } from "react-redux";
import { selectUserBound } from "../../../state/reducers/userBound";
import { GeoJSON } from "react-leaflet";
import { selectBufferedExtents } from "../../../state/reducers/bufferedExtents";
import { selectCachedData } from "../../../state/reducers/cachedData";

export const Renders = () => {
  const userBound = useSelector(selectUserBound);
  const bufferedExtents = useSelector(selectBufferedExtents);
  const cachedData = useSelector(selectCachedData);

  return (
    <>
      {userBound.initialized && (
        <GeoJSON
          data={userBound.data}
          key={Math.random()}
          style={{ color: "red" }}
        />
      )}
      {bufferedExtents.initialized && (
        <GeoJSON data={bufferedExtents.data} key={Math.random()} />
      )}
      {cachedData.data && (
        <GeoJSON
          data={cachedData.data}
          key={Math.random()}
          style={{ color: "purple" }}
        />
      )}
    </>
  );
};
