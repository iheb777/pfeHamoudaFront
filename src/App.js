import logo from './logo.svg';
import {ThemeProvider} from "styled-components";
import {useState} from "react";
import {darkTheme, lightTheme} from "./utils/Theme";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom"
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import styled from 'styled-components';
import Dashboard from './pages/Dashboard';
import Works from './pages/Works';
import Projects from './pages/Projects';
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import ProjectDetails from './pages/ProjectDetails';
import Teams from './pages/Teams';
import ToastMessage from './components/ToastMessage';
import Community from './pages/Community';
import {useSelector} from "react-redux";
import AddNewTeam from './components/AddNewTeam';
import {useEffect} from 'react';
import {getUsers} from './api';
import {useDispatch} from 'react-redux';
import Home from './pages/Home/Home';
import Chats from './pages/Chats';
import ProjectInvite from './components/ProjectInvite';
import TeamInvite from './components/TeamInvite';
import AddNewProject from './components/AddNewProject';
import ManageStudent from "./pages/Admin/ManageStudent";
import CoachDashboard from "./pages/Coach/CoachDashboard";
import JuryDashboard from "./pages/Jury/JuryDashboard";
import AdminMenu from "./pages/Admin/components/AdminMenu";
import AdminHome from "./pages/Admin/AdminHome";
import ManageCoach from "./pages/Admin/ManageCoach";
import ManageJury from "./pages/Admin/ManageJury";
import JuryMenu from "./pages/Jury/components/JuryMenu";
import CoachMenu from "./pages/Coach/components/CoachMenu";
import CoachProjectDetails from "./pages/Coach/CoachProjectDetails";
import AdminAddCoach from "./pages/Admin/components/AdminAddCoach";
import AdminAddJury from "./pages/Admin/components/AdminAddJury";
import JuryProjectDetails from "./pages/Jury/JuryProjectDetails";

const Container = styled.div`
  height: 100vh;
  display: flex;
  background-color: ${({theme}) => theme.bg};
  color: ${({theme}) => theme.text};
  overflow-x: hidden;
`;

const Main = styled.div`
  flex: 7;
`;
const Wrapper = styled.div`
  padding: 0% 1%;
  overflow-y: scroll !important;
`;

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(true);
    const [newTeam, setNewTeam] = useState(false);
    const [newCoach, setNewCoach] = useState(false);
    const [newJury, setNewJury] = useState(false);

    const [newProject, setNewProject] = useState(false);
    const {open, message, severity} = useSelector((state) => state.snackbar);
    const [loading, setLoading] = useState(false);


    const {currentUser} = useSelector(state => state.user);
    //set the menuOpen state to false if the screen size is less than 768px
    useEffect(() => {
        const resize = () => {
            if (window.innerWidth < 1110) {
                setMenuOpen(false);
            } else {
                setMenuOpen(true);
            }
        }
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <BrowserRouter>
                    {
                        currentUser ?
                            (() => {
                                switch (currentUser.role) {
                                    case "STUDENT":
                                        return <Container>
                                            {loading ? <div>Loading...</div> : <>
                                                {menuOpen && <Menu setMenuOpen={setMenuOpen} setDarkMode={setDarkMode}
                                                                   darkMode={darkMode} setNewTeam={setNewTeam}/>}
                                                <Main>
                                                    <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
                                                    <Wrapper>
                                                        {newTeam && <AddNewTeam setNewTeam={setNewTeam}/>}
                                                        {newProject && <AddNewProject setNewProject={setNewProject}/>}
                                                        <Routes>
                                                            <Route>
                                                                <Route exact path="/"
                                                                       element={<Dashboard setNewTeam={setNewTeam}
                                                                                           setNewProject={setNewProject}/>}/>
                                                                <Route path="projects"
                                                                       element={<Projects newProject={newProject}
                                                                                          setNewProject={setNewProject}/>}/>
                                                                <Route path="teams">
                                                                    <Route path=":id" element={<Teams/>}/>
                                                                </Route>
                                                                <Route path="team/invite">
                                                                    <Route path=":code" element={<TeamInvite/>}/>
                                                                </Route>
                                                                <Route path="projects">
                                                                    <Route path=":id" element={<ProjectDetails/>}/>
                                                                </Route>
                                                                <Route path="projects/invite">
                                                                    <Route path=":code" element={<ProjectInvite/>}/>
                                                                </Route>

                                                                <Route path="works" element={<Works/>}/>
                                                                <Route path="community" element={<Community/>}/>
                                                                <Route path="projects">
                                                                    <Route path=":id/chats" element={<Chats/>}/>
                                                                </Route>
                                                                <Route path="*" element={<div>Not Found</div>}/>
                                                            </Route>
                                                        </Routes>
                                                    </Wrapper>
                                                </Main>
                                            </>
                                            }
                                        </Container>;
                                    case "ADMIN":
                                        return <Container>
                                            {loading ? <div>Loading...</div> : <>
                                                {menuOpen &&
                                                    <AdminMenu setMenuOpen={setMenuOpen} setDarkMode={setDarkMode}
                                                               darkMode={darkMode} setNewTeam={setNewTeam}/>}

                                                <Main>
                                                    <Navbar/>
                                                    <Wrapper>
                                                        {newCoach && <AdminAddCoach/>}
                                                        {newJury && <AdminAddJury/>}
                                                        <Routes>
                                                            <Route>
                                                                <Route exact path="/"
                                                                       element={<AdminHome setNewTeam={setNewTeam}
                                                                                           setNewProject={setNewProject}/>}/>
                                                                <Route exact path="manage-student"
                                                                       element={<ManageStudent/>}/>
                                                                <Route exact path="manage-coach" element={<ManageCoach
                                                                    setNewCoach={setNewCoach}/>}/>
                                                                <Route exact path="manage-jury"
                                                                       element={<ManageJury setNewJury={setNewJury}/>}/>
                                                                <Route path="chats" element={<Chats/>}/>
                                                                <Route path="*" element={<div>Not Found</div>}/>
                                                            </Route>
                                                        </Routes>
                                                    </Wrapper>
                                                </Main>
                                            </>}
                                        </Container>;
                                    case "JURY":
                                        return <Container>
                                            {loading ? <div>Loading...</div> : <>
                                                {menuOpen &&
                                                    <JuryMenu setMenuOpen={setMenuOpen} setDarkMode={setDarkMode}
                                                              darkMode={darkMode} setNewTeam={setNewTeam}/>}
                                                <Main>
                                                    <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
                                                    <Wrapper>
                                                        {newTeam && <AddNewTeam setNewTeam={setNewTeam}/>}
                                                        {newProject && <AddNewProject setNewProject={setNewProject}/>}
                                                        <Routes>
                                                            <Route>
                                                                <Route exact path="/" element={<JuryDashboard setNewTeam={setNewTeam} setNewProject={setNewProject}/>}/>
                                                                <Route path="projects"><Route path=":id" element={<JuryProjectDetails/>}/>
                                                                </Route>
                                                                <Route path="teams"><Route path=":id" element={<Teams/>}/></Route>
                                                                <Route path="chats" element={<Chats/>}/>
                                                                <Route path="*" element={<div>Not Found</div>}/>
                                                            </Route>
                                                        </Routes>
                                                    </Wrapper>
                                                </Main>
                                            </>}
                                        </Container>;
                                    case "COACH":
                                        return <Container>
                                            {loading ? <div>Loading...</div> : <>
                                                {menuOpen &&
                                                    <CoachMenu setMenuOpen={setMenuOpen} setDarkMode={setDarkMode}
                                                               darkMode={darkMode} setNewTeam={setNewTeam}/>}
                                                <Main>
                                                    <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
                                                    <Wrapper>
                                                        {newTeam && <AddNewTeam setNewTeam={setNewTeam}/>}
                                                        {newProject && <AddNewProject setNewProject={setNewProject}/>}
                                                        <Routes>
                                                            <Route>
                                                                <Route exact path="/" element={<CoachDashboard setNewTeam={setNewTeam} setNewProject={setNewProject}/>}/>
                                                                <Route path="projects" element={<Projects newProject={newProject} setNewProject={setNewProject}/>}/>
                                                                <Route path="teams">
                                                                <Route path=":id" element={<Teams/>}/></Route>
                                                                <Route path="team/invite">
                                                                 <Route path=":code" element={<TeamInvite/>}/>
                                                                </Route>
                                                                <Route path="projects"><Route path=":id" element={<CoachProjectDetails/>}/>
                                                                </Route>
                                                                <Route path="projects/invite">
                                                                <Route path=":code" element={<ProjectInvite/>}/>
                                                                </Route>
                                                                <Route path="works" element={<Works/>}/>
                                                            </Route>
                                                        </Routes>
                                                    </Wrapper>
                                                </Main>
                                            </>}
                                        </Container>;
                                    default:
                                        return <ThemeProvider theme={darkTheme}>
                                            <Routes>
                                                <Route exact path="/">
                                                    <Route index element={
                                                        <Home/>}/>
                                                    <Route path="team/invite">
                                                        <Route path=":code" element={<TeamInvite/>}/>
                                                    </Route>
                                                    <Route path="projects/invite">
                                                        <Route path=":code" element={<ProjectInvite/>}/>
                                                    </Route>
                                                </Route>
                                            </Routes>
                                        </ThemeProvider>;
                                }
                            })()
                            : <ThemeProvider theme={darkTheme}>
                                <Routes>
                                    <Route exact path="/">
                                        <Route index element={
                                            <Home/>}/>
                                        <Route path="team/invite">
                                            <Route path=":code" element={<TeamInvite/>}/>
                                        </Route>
                                        <Route path="projects/invite">
                                            <Route path=":code" element={<ProjectInvite/>}/>
                                        </Route>
                                    </Route>
                                </Routes>
                            </ThemeProvider>

                    }
                    {open && <ToastMessage open={open} message={message} severity={severity}/>}

                </BrowserRouter>
            </ThemeProvider>
        </DndProvider>
    );
}

export default App;
