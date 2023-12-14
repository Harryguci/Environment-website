// Handle the active navbar link change
export default function ActiveNavLink(type) {
  const navItems = document.getElementsByClassName("nav-link");
  // console.log(navItems);
  try {
    for (let i = 0; i < navItems.length; i++) {
      navItems[i].classList = ["nav-link"];
      // console.log(navItems[i].classList);
      if (navItems[i].getAttribute("name") === type)
       navItems[i].classList.add("active");
    }
  } catch (e) {
    console.log("[ActiveNavLink]", e);
  } finally{
    // console.log(navItems);
  }
}
