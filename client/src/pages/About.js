import { useEffect, useState, memo, useContext } from "react";
import "../Assets/CSS/About.scss";
import ActiveNavLink from "../helpers/ActiveNavLink";
import CurrentPageContext from "../helpers/CurrentPageContext";

function About() {
  const [htmlFileString, setHtmlFileString] = useState();
  const { setPageState } = useContext(CurrentPageContext);

  useEffect(() => setPageState("about"), [setPageState]);

  async function fetchHtml() {
    setHtmlFileString(await (await fetch(`/AboutHTML/index.html`)).text());
  }

  useEffect(() => ActiveNavLink("about"), []);
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



