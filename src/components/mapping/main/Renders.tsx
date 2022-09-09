import { useMap, useMapEvent } from "react-leaflet";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createPolygonFromBound } from "../../../helpers/geometry";
import {
  USER_BOUND_INITIALIZE,
  USER_BOUND_UPDATE_ON_MOVE,
  USER_BOUND_UPDATE_ON_ZOOM,
} from "../../../state/actions";
import { selectUserBound } from "../../../state/reducers/userBound";

export const Renders = () => {
  const dispatch = useDispatch();
  const map = useMap();
  const { initialized, data } = useSelector(selectUserBound);

  useMapEvent("zoomend", (_e) => {
    if (map.getZoom() > 9) {
      if (!initialized) {
        dispatch({
          type: USER_BOUND_INITIALIZE,
          payload: {
            feature: createPolygonFromBound(map.getBounds()),
          },
        });
      } else {
        dispatch({
          type: USER_BOUND_UPDATE_ON_ZOOM,
          payload: {
            feature: createPolygonFromBound(map.getBounds()),
          },
        });
      }
    }
  });

  useMapEvent("moveend", (_e) => {
    if (map.getZoom() > 9) {
      dispatch({
        type: USER_BOUND_UPDATE_ON_MOVE,
        payload: {
          feature: createPolygonFromBound(map.getBounds()),
        },
      });
    }
  });

  return <></>;
};
