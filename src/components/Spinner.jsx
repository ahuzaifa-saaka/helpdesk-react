import {Oval} from "react-loader-spinner";

function Spinner({height = 80, width = 80}) {
  return (
    <div
      style={{
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Oval
        height={20}
        width={20}
        color="#fff"
        secondaryColor="#7c3aed"
        strokeWidth={3}
        strokeWidthSecondary={3}
        visible={true}
      />
    </div>
  );
}

export default Spinner;
