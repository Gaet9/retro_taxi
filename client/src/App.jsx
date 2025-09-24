import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Layout } from "./components/Layout";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Blogs } from "./pages/Blogs";
import { NewBlog } from "./pages/NewBlog";
import { UpdateBlog } from "./pages/UpdateBlog";
import { ContactDetail } from "./pages/ContactDetail";
// import { Projects } from "./pages/Projects";
import { SingleBlog } from "./pages/SingleBlog";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { ProtectedRoutes } from "./pages/ProtectedRoutes";
import { PrivateRoutes } from "./pages/PrivateRoutes";
import { Profile } from "./pages/Profile";
import { MapSection } from "./pages/MapSection";

function App() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                {/* Public routes */}
                <Route index element={<Home />} />
                <Route path='blogs' element={<Blogs />} />
                <Route path='about' element={<About />} />
                <Route path='contact' element={<Contact />} />
                <Route path='map' element={<MapSection />} />
                <Route path='login' element={<Login />} />
                <Route path='sign-up' element={<SignUp />} />
                <Route path='profile' element={<Profile />} />
                {/* Protected routes, for logged in user */}
                <Route element={<ProtectedRoutes />}>
                    <Route path='blogs/:id' element={<SingleBlog />} />
                    {/* Private routes, for admin */}
                    <Route element={<PrivateRoutes />}>
                        <Route path='admin-dash' element={<AdminDashboard />} />
                        <Route path='new-blog' element={<NewBlog />} />
                        <Route path='update-blog/:id' element={<UpdateBlog />} />
                        <Route path='contact-detail/:id' element={<ContactDetail />} />
                    </Route>
                </Route>
                {/* Catch all 404  */}
                <Route path='*' element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
