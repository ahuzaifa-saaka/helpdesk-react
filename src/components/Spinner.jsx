import {Oval} from "react-loader-spinner";

function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "var(--bg)",
      }}
    >
      <Oval
        height={60}
        width={60}
        color="#4f6ef7"
        secondaryColor="#7c3aed"
        strokeWidth={3}
        strokeWidthSecondary={3}
        visible={true}
      />
    </div>
  );
}

export default Spinner;
