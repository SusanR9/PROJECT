import { useState } from "react";
import "../App.css";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields");
      return;
    }

    console.log("Message Sent:", form);

    // show success popup
    setSuccess(true);

    // reset form
    setForm({
      name: "",
      email: "",
      message: "",
    });

    // auto close popup after 2 sec
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="contact-page">

      {/* SUCCESS POPUP */}
      {success && (
        <div className="popup">
          Message sent successfully ✅
        </div>
      )}

      <div className="contact-card">

        <h1>Contact Us</h1>
        <p className="subtitle">We’d love to hear from you 💬</p>

        <form className="contact-form" onSubmit={handleSubmit}>

          <div className="row">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit">Send Message</button>

        </form>

      </div>

    </div>
  );
};

export default Contact;