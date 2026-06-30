import Card from "./Card";

export default function ResultDashboard({ result }) {

  const score = result?.score || 0;

  const color =
    score >= 80
      ? "#16a34a"
      : score >= 60
      ? "#f59e0b"
      : "#dc2626";

  return (

    <div
      style={{
        marginTop: "35px"
      }}
    >

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "25px"
        }}
      >

        <Card
          title="ATS Score"
          color={color}
        >

          <div
            style={{
              textAlign: "center"
            }}
          >

            <div
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color
              }}
            >

              {score}%

            </div>

            <div
              style={{
                marginTop: "10px",
                fontSize: "18px",
                fontWeight: "600",
                color
              }}
            >

              {result.verdict}

            </div>

            <div
              style={{
                width: "100%",
                height: "15px",
                background: "#e5e7eb",
                borderRadius: "20px",
                marginTop: "25px",
                overflow: "hidden"
              }}
            >

              <div
                style={{
                  width: `${score}%`,
                  height: "15px",
                  background: color,
                  transition: "0.5s"
                }}
              />

            </div>

          </div>

        </Card>

        <Card
          title="Matched Skills"
          color="#16a34a"
        >

          {

            result.matched_skills?.length

            ?

            result.matched_skills.map((skill,index)=>(

              <SkillChip

                key={index}

                text={skill}

                success

              />

            ))

            :

            <Empty text="No matched skills"/>

          }

        </Card>

        <Card
          title="Missing Skills"
          color="#dc2626"
        >

          {

            result.missing_skills?.length

            ?

            result.missing_skills.map((skill,index)=>(

              <SkillChip

                key={index}

                text={skill}

              />

            ))

            :

            <Empty text="No missing skills"/>

          }

        </Card>

        <Card
          title="AI Recommendations"
          color="#2563eb"
        >

          {

            result.recommendations?.length

            ?

            result.recommendations.map((item,index)=>(

              <div

                key={index}

                style={{
                  marginBottom:"15px",
                  padding:"12px",
                  background:"#eff6ff",
                  borderRadius:"10px"
                }}

              >

                💡 {item}

              </div>

            ))

            :

            <Empty text="No recommendations"/>

          }

        </Card>

      </div>

    </div>

  );

}

function SkillChip({

  text,

  success=false

}){

  return(

    <div

      style={{

        display:"inline-block",

        padding:"10px 15px",

        margin:"8px",

        borderRadius:"25px",

        background:

          success

          ?

          "#dcfce7"

          :

          "#fee2e2",

        color:

          success

          ?

          "#166534"

          :

          "#991b1b",

        fontWeight:"600"

      }}

    >

      {

        success

        ?

        "✅"

        :

        "❌"

      }

      {" "}

      {text}

    </div>

  );

}

function Empty({

  text

}){

  return(

    <div

      style={{

        color:"#6b7280",

        textAlign:"center",

        padding:"30px"

      }}

    >

      {text}

    </div>

  );

}
