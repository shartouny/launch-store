export function applyTheme(theme) {
  const root = document.documentElement
  Object.keys(theme).forEach((cssVar) => {
    root.style.setProperty(cssVar, theme[cssVar])
  })
}
