import { useTheme } from "../context/ThemeContext";
export default function Table({

  columns = [],

  data = [],

  emptyMessage = "No Records Found"

}) {
const { colors } = useTheme();
  return (

    <div

      style={{

        overflowX: "auto",

        marginTop: "20px"

      }}

    >

      <table

        style={{

          width: "100%",

          borderCollapse: "collapse",

          background: "#ffffff"

        }}

      >

        <thead>

          <tr>

            {

              columns.map((column)=>(

                <th

                  key={column.key}

                  style={{

                    padding:"15px",

                    textAlign:"left",

                    background:"#f8fafc",

                    borderBottom:"2px solid #e5e7eb",

                    color:"#374151",

                    fontWeight:"600"

                  }}

                >

                  {column.title}

                </th>

              ))

            }

          </tr>

        </thead>

        <tbody>

        {

          data.length===0

          ?

          <tr>

            <td

              colSpan={columns.length}

              style={{

                textAlign:"center",

                padding:"40px",

                color: colors.subText

              }}

            >

              {emptyMessage}

            </td>

          </tr>

          :

          data.map((row,index)=>(

            <tr

              key={index}

              style={{

                borderBottom:"1px solid #f3f4f6"

              }}

            >

              {

                columns.map(column=>(

                  <td

                    key={column.key}

                    style={{

                      padding:"15px"

                    }}

                  >

                    {

                      column.render

                      ?

                      column.render(row)

                      :

                      row[column.key]

                    }

                  </td>

                ))

              }

            </tr>

          ))

        }

        </tbody>

      </table>

    </div>

  );

}
