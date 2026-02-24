import React from "react";
import { ThemeProvider } from "./theme";
import { LanguageProvider } from "../i18n";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import "../styles/fonts.css";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
      </LanguageProvider>
    </ThemeProvider>
  );
}
