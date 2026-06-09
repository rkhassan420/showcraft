import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ErrorPage } from './page/errorPage.jsx'
import { ThemeProvider } from './page/ThemeContext.jsx'
import Loading from './page/loading.jsx'
import { AuthProvider } from './AuthContext.jsx'
import { ToastProvider } from './utils/useToast'


const LandingPage        = lazy(() => import('./landing/LandingPage.jsx'))
const AdminPanel         = lazy(() => import('./admin/admin.jsx'))
const AdminAbout         = lazy(() => import('./admin/AdminAbout.jsx'))
const AdminProjects      = lazy(() => import('./admin/AdminProjects.jsx'))
const AdminFooter        = lazy(() => import('./admin/AdminFooter.jsx'))
const AdminLogin         = lazy(() => import('./admin/login.jsx'))
const AdminRegister      = lazy(() => import('./admin/register.jsx'))
const ForgotPasswordPage = lazy(() => import('./admin/ForgotPasswordPage.jsx'))
const UserPortfolio      = lazy(() => import('./page/UserPortfolio.jsx'))
const Analytics          = lazy(() => import('./admin/Analytics.jsx'))
const OAuthCallback      = lazy(() => import('./admin/Oauthcallback.jsx'))
const AdminProjectDetail = lazy(() => import('./admin/adminprojectdetail/Adminprojectdetail.jsx'))
const ProjectDetailPage  = lazy(() => import('./components/projectdetail/Projectdetailpage.jsx'))



const S  = (C) => <Suspense fallback={<Loading />}><C /></Suspense>

const NS = (C) => (
  <Suspense fallback={null}>
    <C />
  </Suspense>
)

const router = createBrowserRouter([
  
  { path: '/',                  element: S(LandingPage),  errorElement: <ErrorPage />},
  { path: 'admin', element: S(AdminPanel) },
  { path: 'admin/login',        element: S(AdminLogin) },
  { path: '/forgot-password',   element: S(ForgotPasswordPage) },
  { path: 'admin/register',     element: S(AdminRegister) },
  { path: 'adminAbout',         element: S(AdminAbout) },
  { path: 'adminProjects',      element: S(AdminProjects) },
  { path: 'adminFooter',        element: S(AdminFooter) },
  { path: '/portfolio/:username',element: NS(UserPortfolio), errorElement: <ErrorPage /> },
  { path: 'adminAnalytics',     element: S(Analytics) },
  { path: '/oauth/callback',    element: S(OAuthCallback) },
  { path:"/adminProjects/:id/detail",  element: S(AdminProjectDetail) },
  { path:"/portfolio/:slug/projects/:id", element: S(ProjectDetailPage), errorElement: <ErrorPage /> }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)