import { useCallback, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebarMenu } from '@app/store/reducers/ui';
import UserDropdown from '@app/modules/main/header/user-dropdown/UserDropdown';

const HeaderContent = () => {
  const { t } = useTranslation(); // Using the new syntax without array destructuring
  const dispatch = useDispatch();
  const navbarVariant = useSelector((state: any) => state.ui.navbarVariant);
  const headerBorder = useSelector((state: any) => state.ui.headerBorder);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  const getContainerClasses = useCallback(() => {
    let classes = `main-header navbar navbar-expand ${navbarVariant}`;
    if (headerBorder) {
      classes = `${classes} border-bottom-0`;
    }
    return classes;
  }, [navbarVariant, headerBorder]);

  return (
    <nav className={getContainerClasses()}>
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            onClick={handleToggleMenuSidebar}
            type="button"
            className="nav-link"
          >
            <i className="fas fa-bars" />
          </button>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">
            {t('header.label.home')}
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <UserDropdown />
      </ul>
    </nav>
  );
};

const Header = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <HeaderContent />
  </Suspense>
);

export default Header;