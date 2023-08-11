import { useEffect, useState, memo } from "react";
import "../Assets/CSS/About.scss";
import ActiveNavLink from "../helpers/ActiveNavLink";

function About() {
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

export default memo(About)



