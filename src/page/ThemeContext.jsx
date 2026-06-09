import { createContext, useState, useEffect } from "react";
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  // const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light-theme");

  const [theme, setTheme] = useState(() => {
  const saved = localStorage.getItem("theme") || "light-theme";
  document.body.className = saved; // ← apply immediately, not in useEffect
  return saved;
});

  const handleTheme = () => {

    if (theme === "dark-theme") {

      setTheme("light-theme");
      localStorage.setItem("theme", "light-theme");

    } else {

      setTheme("dark-theme");
      localStorage.setItem("theme", "dark-theme");
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);


  
  return (
    <ThemeContext.Provider value={{ theme, handleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
