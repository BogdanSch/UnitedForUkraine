import { FC, useEffect } from "react";
import { useLocalStorage } from "../../hooks";
import { DARK_THEME_CLASS_NAME } from "../../variables";

type Theme = "light" | "dark";

const ThemeSwitchButton: FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>("site-theme", "light");
  const body = document.body;

  const toggleSiteTheme = (): void => {
    if (theme === "light") {
      setTheme("dark");
      body.classList.add(DARK_THEME_CLASS_NAME);
    } else {
      setTheme("light");
      body.classList.remove(DARK_THEME_CLASS_NAME);
    }
  };

  useEffect(() => {
    if (theme === "dark") body.classList.add(DARK_THEME_CLASS_NAME);
    else body.classList.remove(DARK_THEME_CLASS_NAME);
  }, [theme]);

  return (
    <button className="theme-button btn" onClick={toggleSiteTheme}>
      <svg className="theme-button__icon">
        {theme === "dark" ? (
          <use xlinkHref="#moon"></use>
        ) : (
          <use xlinkHref="#sun"></use>
        )}
      </svg>
    </button>
  );
};

export default ThemeSwitchButton;
