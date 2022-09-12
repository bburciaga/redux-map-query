import { difference, intersect } from "@turf/turf";
import { useMap, useMapEvent } from "react-leaflet";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createExtent, createUserGeo, getClosestExtent, getDirectionFromBound } from "../../../helpers/geometry";
import {
  BUFFERED_EXTENTS_INITIALIZE,
  BUFFERED_EXTENTS_UPDATE_REQUEST,
  USER_BOUND_INITIALIZE,
  USER_BOUND_UPDATE_ON_MOVE,
  USER_BOUND_UPDATE_ON_ZOOM,
} from "../../../state/actions";
import { selectBufferedExtents } from "../../../state/reducers/bufferedExtent";
import { selectUserBound } from "../../../state/reducers/userBound";

export const Renders = () => {
  const dispatch = useDispatch();
  const map = useMap();
  const userBound = useSelector(selectUserBound);
  const bufferedExtents = useSelector(selectBufferedExtents);

  useMapEvent("zoomend", (_e) => {
    if (map.getZoom() > 8) {
      /* User Bound Actions */
      const tempBounds = map.getBounds();
      const userGeo = createUserGeo(tempBounds);

      if (!userBound.initialized) {
        dispatch({
          type: USER_BOUND_INITIALIZE,
          payload: {
            feature: userGeo
          },
        });
      } else {
        dispatch({
          type: USER_BOUND_UPDATE_ON_ZOOM,
          payload: {
            feature: userGeo
          },
        });
      }

      /* Buffered Extent Actions */
      if (!bufferedExtents.initialized) {
        dispatch({
          type: BUFFERED_EXTENTS_INITIALIZE,
          payload: {
            feature: createExtent(map.getCenter()), // create bound from center
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
            feature: userGeo
          }
        });
      }
      
      /* Buffered Extents */
      if (bufferedExtents.initialized) {
        const tempExtents = bufferedExtents.data.features;
        const intersects: any[] = [];
        const userCenter = map.getCenter();

        tempExtents.forEach((extent: any) => {
          if (intersect(userGeo, extent)) {
            intersects.push(extent);
          }
        })

        switch (intersects.length) {
          case 0:
            const closestExtent: any = getClosestExtent(userCenter, tempExtents);
            const direction: string = getDirectionFromBound(userCenter, closestExtent);
            const newExtent: any = createExtent(
              closestExtent.properties.center,
              direction
            );

            dispatch({
              type: BUFFERED_EXTENTS_UPDATE_REQUEST,
              payload: {
                data: newExtent
              }
            });
            break;
          case 1:
            break;
          case 2:
            break;
          case 3:
            break;
        }
      }
    }
  });

  return <></>;
};
