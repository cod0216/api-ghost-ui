import React from 'react';
import RoutingModal from '@/common/components/RoutingModal';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <>
      <RoutingModal />
      <Outlet />
    </>
  );
};

export default AppLayout;
