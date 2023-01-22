import { useRouter } from "next/router";
import Link from "next/link";
import PropTypes from "prop-types";

export default NavLink;

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};

NavLink.defaultProps = {
  exact: false,
};

function NavLink({ href, exact, children, ...props }) {
  const { asPath } = useRouter();
  const isActive = exact ? asPath === href : asPath.startsWith(href);

  if (isActive) {
    props.className += " nav-link-active";
  }

  return (
    <Link href={href}>
      <a {...props}>{children}</a>
    </Link>
  );
}
