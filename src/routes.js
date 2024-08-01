import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './pages/Login';
import Book from './pages/Book';

export default function Router(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Login} />
                <Route path="/book" Component={Book} />
            </Routes>
        </BrowserRouter>
    );
}