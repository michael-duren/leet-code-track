import type { ParentComponent } from "solid-js";

const Layout: ParentComponent = (props) => {
  return (
    <div>
      <header></header>
      <main>{props.children}</main>
      <footer></footer>
    </div>
  );
};

export default Layout;
