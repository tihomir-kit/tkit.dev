import React, { useContext } from 'react';
import Drawer from '@/components/drawer/drawer';
import { DrawerContext } from '@/components/drawer/drawer-context';
import Menu from './menu';
import {
  MobileMenuWrapper,
  DrawerContentWrapper,
  DrawerHead,
  DrawerLogo,
  DrawerClose,
  HamburgerIcon,
} from './navbar.style';
import { FiX } from 'react-icons/fi';

type MobileMenuProps = {
  items: any;
  logo: any;
};

const MobileMenu: React.FunctionComponent<MobileMenuProps> = ({ items, logo, ...props }) => {
  const { state, dispatch }: any = useContext(DrawerContext);

  // Toggle drawer
  const toggleDrawer = () => {
    dispatch({
      type: 'TOGGLE',
    });
  };

  return (
    <MobileMenuWrapper {...props}>
      <Drawer
        width="285px"
        placement="left"
        drawerHandler={
          <HamburgerIcon>
            <span />
            <span />
            <span />
          </HamburgerIcon>
        }
        open={state.isOpen}
        toggleHandler={toggleDrawer}
      >
        <DrawerContentWrapper>
          <DrawerHead>
            <DrawerLogo>{logo}</DrawerLogo>
            <DrawerClose onClick={toggleDrawer}>
              <FiX />
            </DrawerClose>
          </DrawerHead>
          <Menu items={items} className="mobile-menu" />
        </DrawerContentWrapper>
      </Drawer>
    </MobileMenuWrapper>
  );
};

export default MobileMenu;
