export default function ApplicationChart() {

  const data = [

    { month: "Jan", value: 5 },

    { month: "Feb", value: 8 },

    { month: "Mar", value: 12 },

    { month: "Apr", value: 18 },

    { month: "May", value: 22 },

    { month: "Jun", value: 30 }

  ];

  return (

    <div

      style={{

        background: colors.card,
border: colors.borderStyle,

        padding:"25px",

        borderRadius:"18px",

        boxShadow:"0 8px 25px rgba(0,0,0,.06)"

      }}

    >

      <h2>

        Monthly Applications

      </h2>

      {

        data.map(item=>(

          <div

            key={item.month}

            style={{

              marginTop:"18px"

            }}

          >

            <div

              style={{

                display:"flex",

                justifyContent:"space-between"

              }}

            >

              <span>

                {item.month}

              </span>

              <span>

                {item.value}

              </span>

            </div>

            <div

              style={{

                height:"10px",

                background:"#e5e7eb",

                borderRadius:"20px",

                marginTop:"8px"

              }}

            >

              <div

                style={{

                  width:`${item.value*3}%`,

                  height:"100%",

                  background:"#2563eb",

                  borderRadius:"20px"

                }}

              />

            </div>

          </div>

        ))

      }

    </div>

  );

}
