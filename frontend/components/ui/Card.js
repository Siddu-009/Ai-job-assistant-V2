export default function Card({

  title,

  subtitle,

  children,

  actions,

  style = {}

}) {

  return (

    <div

      style={{

        background: "#ffffff",

        borderRadius: "18px",

        border: "1px solid #e5e7eb",

        boxShadow: "0 8px 25px rgba(0,0,0,.06)",

        padding: "24px",

        marginBottom: "25px",

        transition: "all .25s ease",

        ...style

      }}

    >

      {(title || actions) && (

        <div

          style={{

            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",

            marginBottom: "18px"

          }}

        >

          <div>

            {title && (

              <h2

                style={{

                  margin: 0,

                  fontSize: "22px",

                  fontWeight: "700",

                  color: "#111827"

                }}

              >

                {title}

              </h2>

            )}

            {subtitle && (

              <p

                style={{

                  marginTop: "6px",

                  color: "#6b7280",

                  fontSize: "14px"

                }}

              >

                {subtitle}

              </p>

            )}

          </div>

          {actions}
        </div>

      )}

      {children}

    </div>

  );

}
