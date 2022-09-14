import { difference, intersect } from "@turf/turf";
import { useMap, useMapEvent } from "react-leaflet";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createExtent, createUserGeo } from "../../../helpers/geometry";
import {
  BUFFERED_EXTENTS_INITIALIZE,
  BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS_REQUEST,
  USER_BOUND_INITIALIZE,
  USER_BOUND_UPDATE_ON_MOVE,
  USER_BOUND_UPDATE_ON_ZOOM,
} from "../../../state/actions";
import { selectBufferedExtents } from "../../../state/reducers/bufferedExtents";
import { selectCachedData } from "../../../state/reducers/cachedData";
import { selectUserBound } from "../../../state/reducers/userBound";

export const Renders = () => {
  const dispatch = useDispatch();
  const map = useMap();
  const userBound = useSelector(selectUserBound);
  const bufferedExtents = useSelector(selectBufferedExtents);
  const cachedData = useSelector(selectCachedData);

  useMapEvent("zoomend", (_e) => {
    if (map.getZoom() > 8) {
      /* User Bound Actions */
      const tempBounds = map.getBounds();
      const userGeo = createUserGeo(tempBounds);

      if (!userBound.initialized) {
        dispatch({
          type: USER_BOUND_INITIALIZE,
          payload: {
            feature: userGeo,
          },
        });
      } else {
        dispatch({
          type: USER_BOUND_UPDATE_ON_ZOOM,
          payload: {
            feature: userGeo,
          },
        });
      }

      /* Buffered Extent Actions */
      if (!bufferedExtents.initialized) {
        dispatch({
          type: BUFFERED_EXTENTS_INITIALIZE,
          payload: {
            features: [createExtent(map.getCenter())],
          },
        });
      }
    }
  });

  useMapEvent("moveend", (_e) => {
    if (map.getZoom() > 8) {
      const userGeo = createUserGeo(map.getBounds());
      /* User Bound */
      if (userBound.initialized) {
        dispatch({
          type: USER_BOUND_UPDATE_ON_MOVE,
          payload: {
            feature: userGeo,
          },
        });
      }

      /* Buffered Extents */
      if (bufferedExtents.initialized) {
        const tempExtents = bufferedExtents.data.features;
        const intersects: any[] = [];

        tempExtents.forEach((extent: any) => {
          if (intersect(userGeo, extent)) {
            intersects.push(extent);
          }
        });

        switch (intersects.length) {
          case 0:
            dispatch({
              type: BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST,
              payload: {
                aGeo: userGeo,
                extents: tempExtents,
                intersects: null,
                cached_features: cachedData.data.features,
              },
            });
            break;
          case 1:
            dispatch({
              type: BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTIONS_REQUEST,
              payload: {
                aGeo: userGeo,
                extents: tempExtents,
                intersects: intersects,
                cached_features: cachedData.data.features,
              },
            });
            break;
          case 2:
            dispatch({
              type: BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS_REQUEST,
              payload: {
                aGeo: userGeo,
                extents: tempExtents,
                intersects: intersects,
                cached_features: cachedData.data.features,
              },
            });
            break;
          case 3:
            dispatch({
              type: BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS_REQUEST,
              payload: {
                aGeo: userGeo,
                extents: tempExtents,
                intersects: intersects,
                cached_features: cachedData.data.features,
              },
            });
            break;
        }
      }
    }
  });

  return <></>;
};
