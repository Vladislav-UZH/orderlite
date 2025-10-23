import { useLocation, useNavigate } from 'react-router';
import { TabBar, TabItem, TabIcon, IconMenu, IconChat, IconUser } from './ui/ui-kit';

export default function BottomTabs() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  interface PathChecker {
    (prefix: string): boolean;
  }

  const is: PathChecker = (prefix: string): boolean =>
    pathname === prefix || pathname.startsWith(prefix);

  return (
    <TabBar>
      <TabItem $active={is('/menu')} onClick={() => nav('/menu')}>
        <TabIcon>
          <IconMenu />
        </TabIcon>
        Menu
      </TabItem>

      <TabItem $active={is('/orders')} onClick={() => nav('/orders')}>
        <TabIcon>
          <IconChat />
        </TabIcon>
        Orders/Status
      </TabItem>

      <TabItem $active={is('/profile')} onClick={() => nav('/profile')}>
        <TabIcon>
          <IconUser />
        </TabIcon>
        Profile
      </TabItem>
    </TabBar>
  );
}
