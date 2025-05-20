import { Routes, Route } from 'react-router-dom';
import React from 'react';
import './index.css';
import Profile from './Pages/Profile';
import Homepage from './Pages/Homepages';
import NotesFeed from './Pages/NotesFeed';
import Login from './Login/Login'; 
import Register from './Login/Register'; 
import Detail from './Pages/Detail';
import Community from './Pages/Community';
function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Homepage />} />
                
                <Route path="/profile" element={<Profile />} />
                <Route path="/notes" element={<NotesFeed />} />
                <Route path="/not/:id" element={<Detail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/community/:communityId" element={<Community />} />
            </Routes>
        </>
    );
}

export default App;