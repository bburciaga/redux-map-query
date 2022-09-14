import { useSelector } from "react-redux";
import { selectUserBound } from "../../../state/reducers/userBound";
import { GeoJSON } from "react-leaflet";
import { selectBufferedExtents } from "../../../state/reducers/bufferedExtents";
import { selectCachedData } from "../../../state/reducers/cachedData";
import React from "react";
import InfoBox from "./InfoBox";

export const Renders = () => {
  const userBound = useSelector(selectUserBound);
  const bufferedExtents = useSelector(selectBufferedExtents);
  const cachedData = useSelector(selectCachedData);

  const countRef = React.useRef(0);
  countRef.current++;

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
      {cachedData.initialized && (
        <GeoJSON
          data={cachedData.data}
          key={Math.random()}
          style={{ color: "purple" }}
        />
      )}
      <InfoBox count={countRef.current} />
    </>
  );
};
