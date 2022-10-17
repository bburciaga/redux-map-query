import { useSelector } from "react-redux";
import { GeoJSON } from "react-leaflet";
import React from "react";
import InfoBox from "./InfoBox";
import BufferedExtents from "../BufferedExtents";
import CachedData from "../CachedData";
import { selectUserSettings } from "../../../state/reducers/userSettings";

export const Renders = () => {
  const userSettings = useSelector(selectUserSettings);

  const countRef = React.useRef(0);
  countRef.current++;

  return (
    <>
      {userSettings.initialized && userSettings.zoom_level > 9 && (
        <GeoJSON
          data={userSettings.user_bounds}
          key={Math.random()}
          style={{ color: "red" }}
        />
      )}
      <BufferedExtents proof={true} dispatchActions={false} />
      <CachedData />
      <InfoBox count={countRef.current} />
    </>
  );
};
