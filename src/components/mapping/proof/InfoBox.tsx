import { useSelector } from "react-redux";
import { selectBufferedExtents } from "../../../state/reducers/bufferedExtents";
import { selectUserBound } from "../../../state/reducers/userBound";

const InfoBox = (props: any) => {
  const { count } = props;
  const bufferedExtents = useSelector(selectBufferedExtents);
  const userBound = useSelector(selectUserBound);

  return (
    <div
      style={{
        zIndex: 9999,
        backgroundColor: "white",
        width: 220,
        height: 150,
        borderRadius: 10,
        margin: 5,
        position: "absolute",
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: "black",
      }}
    >
      <p style={{ margin: 15 }}>Page Render Count: {count}</p>
      <p style={{ margin: 15 }}>
        Buffered Extents Change Count: {bufferedExtents.count}
      </p>
      <p style={{ margin: 15 }}>User Bound Change Count: {userBound.count}</p>
    </div>
  );
};

export default InfoBox;
