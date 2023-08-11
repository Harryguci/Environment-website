import { useEffect, useState } from "react";
import "../Assets/CSS/About.scss";
import ActiveNavLink from "../helpers/ActiveNavLink";
export default function About() {
  let [htmlFileString, setHtmlFileString] = useState();
  useEffect(() => ActiveNavLink("about"), []);

  async function fetchHtml() {
    setHtmlFileString(await (await fetch(`/AboutHTML/index.html`)).text());
  }
  useEffect(() => {
    fetchHtml();
  }, []);

  return (
    <div className="App">
      <div className="about-container">
        <div dangerouslySetInnerHTML={{ __html: htmlFileString }}></div>
      </div>
    </div>
  );
}
