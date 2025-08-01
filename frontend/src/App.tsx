
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import LoginPage from './components/screens/LoginPage/LoginPage'
import SignUpPage from './components/screens/SignUpPage/SignupPage'
import Dashboard from './components/screens/Dashboard/Dashboard'
import CreateProject from './components/screens/Projects/CreateProject'
import Projects from './components/screens/Projects/Projects'
import ProjectDetail from './components/screens/Projects/ProjectDetail'
import Assignments from './components/screens/Assignments/Assignments'
import AssignmentDetail from './components/screens/Assignments/AssignmentDetail'
import Engineer from './components/screens/Engineer/Engineer'
import EngineerDetail from './components/screens/EngineerDetail/EngineerDetail'
// import Planner from './components/screens/Planner/Planner'
import EngineerDashboard from './components/screens/EngineerDashboard/EngineerDashboard'
import Layout from './components/layout/Layout'
import EngineerProfilePage from './components/screens/Profile/Profile'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />

        {/* Protected routes */}
        <Route
          path='/dashboard'
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path='/projects'
          element={
            <Layout>
              <Projects />
            </Layout>
          }
        />
        <Route
          path='/projects/:id'
          element={
            <Layout>
              <ProjectDetail />
            </Layout>
          }
        />
        <Route
          path='/projects/create'
          element={
            <Layout>
              <CreateProject />
            </Layout>
          }
        />
        <Route
          path='/engineers'
          element={
            <Layout>
              <Engineer />
            </Layout>
          }
        />
        <Route
          path='/engineers/:id'
          element={
            <Layout>
              <EngineerDetail />
            </Layout>
          }
        />
        <Route
          path='/profile'
          element={
            <Layout>
              <EngineerProfilePage />
            </Layout>
          }
        />

        <Route
          path='/assignments'
          element={
            <Layout>
              <Assignments />
            </Layout>
          }
        />
        <Route
          path='/assignments/:id'
          element={
            <Layout>
              <AssignmentDetail />
            </Layout>
          }
        />

        {/* <Route
          path='/planner'
          element={
            <Layout>
              <Planner />
            </Layout>
          }
        /> */}

        <Route
          path='/engineer-dashboard'
          element={
            <Layout>
              <EngineerDashboard />
            </Layout>
          }
        />

        <Route
          path='/my-assignments'
          element={
            <Layout>
              <EngineerDashboard />
            </Layout>
          }
        />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  )
}

export default App
