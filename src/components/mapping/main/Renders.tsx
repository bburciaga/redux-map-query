import React, { useEffect } from "react";
import { GeoJSON, useMap, useMapEvent } from "react-leaflet";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createUserGeo } from "../../../helpers/geometry";
import {
  USER_BOUND_INITIALIZE,
  USER_BOUND_UPDATE_ON_MOVE,
  USER_BOUND_UPDATE_ON_ZOOM,
  USER_SETTINGS_INITIALIZE,
  USER_SETTINGS_MOVE_UPDATE_REQUEST,
  USER_SETTINGS_ZOOM_LEVEL_UPDATE_FAIL,
  USER_SETTINGS_ZOOM_LEVEL_UPDATE_REQUEST,
} from "../../../state/actions";
import { selectUserSettings } from "../../../state/reducers/userSettings";
import BufferedExtents from "../BufferedExtents";
import CachedData from "../CachedData";
import InfoBox from "./InfoBox";

export const Renders = () => {
  const dispatch = useDispatch();
  const map = useMap();
  const userSettings = useSelector(selectUserSettings);

  const countRef = React.useRef(0);
  countRef.current++;

  useEffect(() => {
    if (!userSettings.initialized) {
      try {
        dispatch({
          type: USER_SETTINGS_INITIALIZE,
          payload: {
            zoom_level: map.getZoom(),
            user_bounds: createUserGeo(map.getBounds()),
          },
        });
      } catch (error: any) {
        dispatch({
          type: USER_SETTINGS_ZOOM_LEVEL_UPDATE_FAIL,
          payload: {
            error: error,
          },
        });
      }
    }
  }, [userSettings.initialized]);

  useMapEvent("zoomend", (_e) => {
    /* User Bound Actions */
    const tempBounds = map.getBounds();
    const userGeo = createUserGeo(tempBounds);

    dispatch({
      type: USER_SETTINGS_ZOOM_LEVEL_UPDATE_REQUEST,
      payload: {
        zoom_level: map.getZoom(),
        user_bounds: userGeo,
      },
    });
  });

  useMapEvent("moveend", (_e) => {
    if (map.getZoom() > 8) {
      const userGeo = createUserGeo(map.getBounds());
      /* User Bound */
      dispatch({
        type: USER_SETTINGS_MOVE_UPDATE_REQUEST,
        payload: {
          user_bounds: userGeo,
        },
      });
    }
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignContent: "flex-start",
      }}
    >
      <BufferedExtents />
      <CachedData />
      <InfoBox count={countRef.current} />
    </div>
  );
};
