import { Marpit } from "@marp-team/marpit";

export const getMdHtml = (markdown: string) => {
  // 1. Create instance (with options if you want)
  const marpit = new Marpit({ inlineSVG: true });

  // 2. Add theme CSS
  const theme = `
/* @theme default */

section {
  background-color: #369;
  color: #fff;
  font-size: 30px;
  padding: 40px;
}

header,
footer {
  position: absolute;
  left: 50px;
  right: 50px;
  height: 20px;
}

h1,
h2 {
  text-align: center;
  margin: 0;
}

h1 {
  color: #8cf;
}
`;
  marpit.themeSet.default = marpit.themeSet.add(theme);

  // 3. Render markdown

  const { html, css } = marpit.render(markdown);

  // 4. Use output in your HTML
  const htmlFile = `
<!DOCTYPE html>
<html>
  <style>${css}</style>

  <body>
  ${html}
</body></html>
`;
  return htmlFile;
};
