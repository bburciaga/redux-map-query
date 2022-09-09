import { useMap, useMapEvent } from "react-leaflet";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createPolygonFromBoundsObject } from "../../../helpers/geometry";
import {
  BUFFERED_EXTENT_INITIALIZE,
  USER_BOUND_INITIALIZE,
  USER_BOUND_UPDATE_ON_MOVE,
  USER_BOUND_UPDATE_ON_ZOOM,
} from "../../../state/actions";
import { selectBufferedExtent } from "../../../state/reducers/bufferedExtent";
import { selectUserBound } from "../../../state/reducers/userBound";

export const Renders = () => {
  const dispatch = useDispatch();
  const map = useMap();
  const userBound = useSelector(selectUserBound);
  const bufferedExtent = useSelector(selectBufferedExtent);

  useMapEvent("zoomend", (_e) => {
    if (map.getZoom() > 9) {
      /* User Bound Actions */
      if (!userBound.initialized) {
        dispatch({
          type: USER_BOUND_INITIALIZE,
          payload: {
            feature: createPolygonFromBoundsObject(map.getBounds()),
          },
        });
      } else {
        dispatch({
          type: USER_BOUND_UPDATE_ON_ZOOM,
          payload: {
            feature: createPolygonFromBoundsObject(map.getBounds()),
          },
        });
      }

      /* Buffered Extent Actions */
      if (!bufferedExtent.initialized) {
        dispatch({
          type: BUFFERED_EXTENT_INITIALIZE,
          payload: {
            feature: null, // create bound from center
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
          feature: createPolygonFromBoundsObject(map.getBounds()),
        },
      });
    }
  });

  return <></>;
};
