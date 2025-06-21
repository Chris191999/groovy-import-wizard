
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
