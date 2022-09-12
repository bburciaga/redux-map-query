import { BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST, BUFFERED_EXTENTS_UPDATE_SUCCESS } from "../actions";
import { put, takeEvery } from "redux-saga/effects";
import { createExtent, getClosestExtent, getDirectionFromBound } from "../../helpers/geometry";
import { useDispatch } from "react-redux";

function* handle_BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS (action: any) {

        const closestExtent: any = getClosestExtent(action.payload.userCenter, action.payload.extents);
        const direction: string = getDirectionFromBound(action?.payload.userCenter, closestExtent);
        const newExtent: any = createExtent(
            closestExtent.properties.center,
            direction
        );

        const newExtents = [...action.payload.extents, newExtent];
    
        console.log('made it here', newExtents);

        yield put({type: BUFFERED_EXTENTS_UPDATE_SUCCESS, payload: {extents: newExtents}});
}

export default function* bufferedExtentsSaga () {
    yield takeEvery(BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST, handle_BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS);
}