const InfoBox = (props: any) => {
  const { count } = props;

  return (
    <div
      style={{
        zIndex: 9999,
        backgroundColor: "white",
        width: 185,
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
    </div>
  );
};

export default InfoBox;
