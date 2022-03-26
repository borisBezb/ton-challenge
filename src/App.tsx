import React, { FC } from 'react';
import {
  Route,
  Routes,
} from 'react-router-dom';

import Layout from './components/Layout';
import PairList from './pages/PairList';
import PairDetail from './pages/PairDetail';

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PairList />} />
        <Route path="pairs/:poolId" element={<PairDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
