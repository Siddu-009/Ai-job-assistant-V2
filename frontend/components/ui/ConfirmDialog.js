import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({

open,

title="Confirm",

message,

onConfirm,

onCancel

}){

return(

<Modal

open={open}

title={title}

onClose={onCancel}

>

<p>{message}</p>

<div

style={{

display:"flex",

justifyContent:"flex-end",

gap:"10px",

marginTop:"20px"

}}

>

<Button

variant="secondary"

onClick={onCancel}

>

Cancel

</Button>

<Button

variant="danger"

onClick={onConfirm}

>

Confirm

</Button>

</div>

</Modal>

);

}
