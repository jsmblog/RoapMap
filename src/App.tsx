import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import ProtectedRoute from "./utils/ProtectedRoute";
import Landing from "./auth/Landing";
import Auth from "./auth/Auth";
import RoomWaiting from "./auth/RoomWaiting";
import Tabs from "./components/Tabs";
import PageNotFound from "./components/PageNotFound";
import "@ionic/react/css/core.css";
import "./theme/variables.css";
import Unauthorized from "./utils/Unauthorized";
import EditProfile from "./pages/EditProfile";
import Wizard from "./components/Wizard";
import { SplashScreen } from '@capacitor/splash-screen';
import Community from "./pages/Community";

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, [])
  
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/** 1) Landing pública */}
          <ProtectedRoute exact path="/" publicOnly>
            <Landing />
          </ProtectedRoute>

          <ProtectedRoute path="/auth/:mode" publicOnly>
            <Auth />
          </ProtectedRoute>
          <ProtectedRoute path="/area/waiting">
            <RoomWaiting />
          </ProtectedRoute>

          <ProtectedRoute exact path="/wizard/steps">
            <Wizard />
          </ProtectedRoute>
          <ProtectedRoute path="/tab">
            <Tabs />
          </ProtectedRoute>

          <ProtectedRoute path="/edit-profile">
            <EditProfile />
          </ProtectedRoute>

          <ProtectedRoute path="/community">
            <Community />
          </ProtectedRoute>

          {/** 4) Vistas de error */}
          <Route exact path="/unauthorized" component={Unauthorized} />
          <Route exact path="/404" component={PageNotFound} />
          <Route>
            <Redirect to="/404" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}


export default App;
