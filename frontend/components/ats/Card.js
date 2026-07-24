export default function Card({

  title,

  children,

  color = "#2563eb"

}) {

  return (

    <div

      style={{

        background: colors.card,

        borderRadius:"18px",

        padding:"25px",

        boxShadow:"0 10px 25px rgba(0,0,0,.08)",

        borderTop:`5px solid ${color}`,

        transition:"0.3s",

        height:"100%"

      }}

    >

      <h3

        style={{

          marginTop:0,

          marginBottom:"20px",

          color:"#111827",

          fontSize:"20px",

          fontWeight:"700"

        }}

      >

        {title}

      </h3>

      <div>

        {children}

      </div>

    </div>

  );

}
