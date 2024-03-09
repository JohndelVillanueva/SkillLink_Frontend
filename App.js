import React from "react";
import AppNavigation from "./navigation/AppNavigation";
import registerNNPushToken from 'native-notify';

const App = () => {
  registerNNPushToken(16982, 'DsiJB0lueDaLRyhbtZd1y9'); 
  return (
      <AppNavigation />
  );
};

export default App;
