import axios from 'axios';
import React, { useRef, useState } from 'react'
// import { ProductsContext } from '../../App';

const ContactRoute = () => {
  let [contactRes, setContactRes] = useState({ emailErr: false, textareaErr: false, msgSent: false });
  const form = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    for (const pair of new FormData(form.current)) {
      formData.append(pair[0], pair[1]);
    }
    axios.post('http://localhost:5001/contact', formData, { withCredentials: true }).then((res) => {
      setContactRes(res.data);
    }).catch(err => {
      console.log("contact err", err)
      setContactRes({ emailErr: false, textareaErr: false, msgSent: "something went wrong" })
    })
  }
  return (
    <div className='contact'>
      <h4>You Can Now Contact Kanto Shop if you Have Any Issue</h4>
      <form ref={form} onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder='Type Your Email' />
        {contactRes.emailErr ? <div className="red"> {contactRes.emailErr}</div> : ""}
        <textarea name="textarea" cols="30" rows="10" maxLength='300' placeholder='Type Message ...'></textarea>
        {contactRes.textareaErr ? <div className="red"> {contactRes.textareaErr}</div> : ""}
        <input type="submit" value="Send" />
      </form>
      {contactRes.msgSent === true ? <div className="green"> Message Is Sent </div> : ""}
      {typeof contactRes.msgSent === 'string' ? <div className="red"> Something Went Wrong </div> : ""}
    </div>
  )
}

export default ContactRoute