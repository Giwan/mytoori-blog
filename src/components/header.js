import React from "react";
import { Link } from "gatsby";
import "../style/header.css";

const Header = ({ subTitle = "blog" }) => (
    <header className="header">
        <h1>
            <Link to="/">Mytoori</Link>
        </h1>
        <h2>{subTitle}</h2>
    </header>
);

export default Header;
