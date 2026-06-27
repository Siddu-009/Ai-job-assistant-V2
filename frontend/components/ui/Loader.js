export default function Loader({

  text = "Loading..."

}) {

  return (

    <div

      style={{

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "40px",

        fontSize: "18px",

        color: "#6b7280"

      }}

    >

      ⏳ {text}

    </div>

  );

}
