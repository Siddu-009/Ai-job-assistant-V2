import { useEffect, useState } from "react";

export default function AdminManagement() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadUsers();

  }, []);

  const loadUsers = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(

        "/api/admin/",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            token

          })

        }

      );

      const data = await response.json();

      setUsers(

        data.users ||

        data ||

        []

      );

    }

    catch{

      alert("Unable to load users.");

    }

    setLoading(false);

  };

  const deleteUser = async(id)=>{

    if(!confirm("Delete this user?")){

      return;

    }

    await fetch(

      "/api/admin/delete-user",

      {

        method:"POST",

        headers:{

          "Content-Type":"application/json"

        },

        body:JSON.stringify({

          id

        })

      }

    );

    loadUsers();

  };

  const blockUser = async(id)=>{

    await fetch(

      "/api/admin/block-user",

      {

        method:"POST",

        headers:{

          "Content-Type":"application/json"

        },

        body:JSON.stringify({

          id

        })

      }

    );

    loadUsers();

  };

  return(

<div

style={{

maxWidth:"1400px",

margin:"40px auto",

padding:"35px",

background:"#fff",

borderRadius:"20px",

boxShadow:"0 15px 35px rgba(0,0,0,.08)"

}}

>

<h1>

Admin Management

</h1>

<p

style={{

color:"#6b7280"

}}

>

Manage platform users and administrators.

</p>

{

loading &&

<p>

Loading...

</p>

}

<table

style={{

width:"100%",

marginTop:"30px",

borderCollapse:"collapse"

}}

>

<thead>

<tr>

<th style={th}>Name</th>

<th style={th}>Email</th>

<th style={th}>Role</th>

<th style={th}>Status</th>

<th style={th}>Actions</th>

</tr>

</thead>

<tbody>

{

users.map((user,index)=>(

<tr key={index}>

<td style={td}>

{user.name}

</td>

<td style={td}>

{user.email}

</td>

<td style={td}>

{user.role}

</td>

<td style={td}>

{user.status}

</td>

<td style={td}>

<div

style={{

display:"flex",

gap:"10px"

}}

>

<button

style={blockButton}

onClick={()=>blockUser(user.id)}

>

Block

</button>

<button

style={deleteButton}

onClick={()=>deleteUser(user.id)}

>

Delete

</button>

</div>

</td>

</tr>

))

}

</tbody>

</table>

</div>

);

}

const th={

padding:"15px",

borderBottom:"2px solid #ddd",

textAlign:"left"

};

const td={

padding:"15px",

borderBottom:"1px solid #eee"

};

const blockButton={

padding:"10px 18px",

background:"#f59e0b",

color:"#fff",

border:"none",

borderRadius:"8px",

cursor:"pointer"

};

const deleteButton={

padding:"10px 18px",

background:"#dc2626",

color:"#fff",

border:"none",

borderRadius:"8px",

cursor:"pointer"

};
