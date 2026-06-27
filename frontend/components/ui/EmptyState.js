export default function EmptyState({

  title = "Nothing Found",

  description = "No data available."

}) {

  return (

    <div

      style={{

        padding: "50px",

        textAlign: "center",

        color: "#6b7280"

      }}

    >

      <h2>

        {title}

      </h2>

      <p>

        {description}

      </p>

    </div>

  );

}
