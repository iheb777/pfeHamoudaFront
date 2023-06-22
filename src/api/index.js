import axios from 'axios';

const API = axios.create({baseURL: `http://localhost:8700/api/`});


//auth
export const signIn = async ({email, password}) => await API.post('/auth/signin', {email, password});
export const signUp = async ({
                                 name,
                                 email,
                                 password,
                             }) => await API.post('/auth/signup', {
    name,
    email,
    password,
});
export const createCoach = async ({
                                      name,
                                      email,
                                      password,
                                  }) => await API.post('/auth/add/coach', {
    name,
    email,
    password,
});
export const createJury = async ({
                                      name,
                                      email,
                                      password,
                                  }) => await API.post('/auth/add/jury', {
    name,
    email,
    password,
});
export const googleSignIn = async ({
                                       name,
                                       email,
                                       img,
                                   }) => await API.post('/auth/google', {
    name,
    email,
    img,
}, {withCredentials: true});
export const findUserByEmail = async (email) => await API.get(`/auth/findbyemail?email=${email}`);
export const generateOtp = async (email, name, reason) => await API.get(`/auth/generateotp?email=${email}&name=${name}&reason=${reason}`);
export const verifyOtp = async (otp) => await API.get(`/auth/verifyotp?code=${otp}`);
export const resetPassword = async (email, password) => await API.put(`/auth/forgetpassword`, {email, password});

//user api
export const getUsers = async (token) => await API.get('/users/find', {headers: {"Authorization": `Bearer ${token}`}}, {
    withCredentials: true
});
export const searchUsers = async (search, token) => await API.get(`users/search/${search}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const notifications = async (token) => await API.get('/users/notifications', {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const getProjects = async (token) => await API.get(`/users/projects`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const userWorks = async (token) => await API.get('/users/works', {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const userTasks = async (token) => await API.get('/users/tasks', {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});

//projects api
export const createProject = async (project, token) => await API.post('project/', project, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const getProjectDetails = async (id, token) => await API.get(`/project/${id}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const inviteProjectMembers = async (id, members, token) => await API.post(`/project/invite/${id}`, members, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const addWorks = async (id, works, token) => await API.post(`/project/works/${id}`, works, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const getWorks = async (id, token) => await API.get(`/project/works/${id}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const verifyProjectInvite = async (code, projectid, userid, access, role) => await API.get(`/project/invite/${code}?projectid=${projectid}&userid=${userid}&access=${access}&role=${role}`, {withCredentials: true});
export const updateProject = async (id, project, token) => await API.patch(`/project/${id}`, project, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const updateProjectFile = async (id, project, token) => await API.patch(`/project/updateFile/${id}`, project, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});

export const deleteProject = async (id, token) => await API.delete(`/project/${id}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const updateMembers = async (id, members, token) => await API.patch(`/project/member/${id}`, members, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const removeMembers = async (id, members, token) => await API.patch(`/project/member/remove/${id}`, members, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});


//teams api
export const createTeam = async (team, token) => await API.post('team/', team, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const getTeams = async (id, token) => await API.get(`/team/${id}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const inviteTeamMembers = async (id, members, token) => await API.post(`/team/invite/${id}`, members, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const addTeamProject = async (id, project, token) => await API.post(`/team/addProject/${id}`, project, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const verifyTeamInvite = async (code, teamid, userid, access, role) => await API.get(`/team/invite/${code}?teamid=${teamid}&userid=${userid}&access=${access}&role=${role}`, {withCredentials: true});
export const updateTeam = async (id, team, token) => await API.patch(`/team/${id}`, team, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const deleteTeam = async (id, token) => await API.delete(`/team/${id}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const updateTeamMembers = async (id, members, token) => await API.patch(`/team/member/${id}`, members, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const removeTeamMembers = async (id, members, token) => await API.patch(`/team/member/remove/${id}`, members, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});


//admin api
export const getAllProjects = async (token) => await API.get(`/project/all`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const adminDeleteProject = async (id, token) => await API.delete(`/project/admin/${id}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});

export const adminGetAllStudents = async (token) => await API.get(`/users/student`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const adminGetAllCoach = async (token) => await API.get(`/users/coach`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const adminGetAllJury = async (token) => await API.get(`/users/jury`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});



export const addComment = async (id,text,token) => await API.post(`/project/comment/${id}`, text, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});

export const adminDeleteUser = async (id, token) => await API.delete(`/users/admin/${id}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});


export const getComments = async (id, token) => await API.get(`/project/comment/${id}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});


export const addScore = async (id,data,token) => await API.post(`/project/rate/${id}`, data, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const getScore = async (id, token) => await API.get(`/project/rate/${id}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});


export const getTopProject = async (token) => await API.get(`/project/rate/top`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});


export const addChat = async (id,text,token) => await API.post(`/project/chat/${id}`, text, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
export const getChat = async (id, token) => await API.get(`/project/chat/${id}`, {headers: {"Authorization": `Bearer ${token}`}}, {withCredentials: true});
