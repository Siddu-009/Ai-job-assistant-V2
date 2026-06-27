export default function SearchBar({

  value,

  onChange,

  placeholder="Search..."

}){

return(

<input

value={value}

onChange={(e)=>onChange(e.target.value)}

placeholder={placeholder}

style={{

width:"100%",

padding:"14px",

borderRadius:"12px",

border:"1px solid #d1d5db",

fontSize:"15px"

}}

/>

);

}
