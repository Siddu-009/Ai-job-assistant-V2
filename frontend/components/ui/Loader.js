import { useTheme } from "../../context/ThemeContext";
export default function Loader({

  text = "Loading..."

}) {
  const { colors } = useTheme();

  return (

    <div

      style={{

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "40px",

        fontSize: "18px",

        color: colors.subText

      }}

    >

      ⏳ {text}

    </div>

  );

}
