import React, { useEffect } from 'react';
import { Router, Switch, Redirect } from 'react-router-dom';
import { history } from './router/history';
import { setThemeByMode } from './helpers/common';
import { AuthRoute } from './layout/routes/AuthRoute';
import { AppRoute } from './layout/routes/AppRoute';
import { ROUTES } from './constants/app';
import $ from 'jquery';
import LoginPage from './auth/Login';
import PageNotFound from './pages/Shared/PageNotFound';
import AccessDeniedPage from './pages/Shared/AccessDenied';
import ManageFacePage from './pages/Customer/Face';
import FaceForm from './pages/Customer/Face/components/form';
import DemoFaceSearchPage from './pages/Shared/DemoFaceSearch';
import DemoFaceComparePage from './pages/Shared/DemoFaceCompare';
import VoiceForm from './pages/Customer/Voice/components/form';
import ManageVoicePage from './pages/Customer/Voice';
import DemoVoiceMatchPage from './pages/Shared/DemoVoiceMatch';
import WelcomePage from './pages';

function App() {
  useEffect(() => {
    const currentTheme = localStorage.getItem('NEXT_FACE_THEME');
    if (currentTheme) {
      setThemeByMode(currentTheme);
    }

    $(window).on('load', function () {
      setTimeout(() => {
        $(".preloader").delay(500).fadeOut("slow");
      }, 500);
    })
  }, [])

  return (
    <Router history={history}>
      <Switch>
        <AppRoute exact path={ROUTES.WELCOME} component={WelcomePage} />
        {/* For Customer role */}
        <AppRoute exact path={ROUTES.FACES} component={ManageFacePage} />
        <AppRoute exact path={`${ROUTES.FACES}/add-new`} component={FaceForm} />
        <AppRoute exact path={`${ROUTES.FACES}/edit/:id`} component={FaceForm} />
        <AppRoute exact path={ROUTES.VOICES} component={ManageVoicePage} />
        <AppRoute exact path={`${ROUTES.VOICES}/add-new`} component={VoiceForm} />
        <AppRoute exact path={`${ROUTES.VOICES}/edit/:id`} component={VoiceForm} />

        {/* Share */}
        <AuthRoute exact path={ROUTES.LOGIN} component={LoginPage} />
        <AppRoute exact path={ROUTES.FACE_SEARCH_DEMO} component={DemoFaceSearchPage} />
        <AppRoute exact path={ROUTES.FACE_COMPARE_DEMO} component={DemoFaceComparePage} />
        <AppRoute exact path={ROUTES.VOICE_MATCH_DEMO} component={DemoVoiceMatchPage} />
        <AppRoute exact path={ROUTES.ACCESS_DENIED} component={AccessDeniedPage} />
        <AppRoute exact path={ROUTES.PAGE_NOT_FOUND} component={PageNotFound} />
        
        
        <Redirect from='*' to={ROUTES.WELCOME} />
        <Redirect from='**' to={ROUTES.PAGE_NOT_FOUND} />
      </Switch>
    </Router>
  );
}

export default App;
