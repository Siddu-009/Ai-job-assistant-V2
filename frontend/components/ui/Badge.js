export default function Badge({

  text,

  color = "#2563eb"

}) {

  return (

    <span

      style={{

        display: "inline-block",

        padding: "6px 12px",

        background: color,

        color: "#fff",

        borderRadius: "999px",

        fontSize: "13px",

        fontWeight: "600"

      }}

    >

      {text}

    </span>

  );

}
