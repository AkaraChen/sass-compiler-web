import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Index } from './pages';
import { FC } from 'react';
import { VersionPage } from './pages/[version]';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Index />} />
      <Route path="/:version" element={<VersionPage />} />
    </Route>,
  ),
);

export const Router: FC = () => {
  return <RouterProvider router={router} />;
};
