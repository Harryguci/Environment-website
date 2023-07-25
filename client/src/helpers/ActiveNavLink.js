export default function ActiveNavLink(type) {
  var navItem = document.getElementsByClassName("nav-link");
  navItem = [navItem[0], navItem[1], navItem[2], navItem[3], navItem[4]];
  try {
    navItem.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("name") === type) {
        item.classList.add("active");
      }
    });
  } catch (e) {
    console.log("[ActiveNavLink]", e);
  }
}
