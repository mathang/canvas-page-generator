import Handlebars from "handlebars";

export function generateHTML(formData, templateText) {
  const template = Handlebars.compile(templateText);
  return template(formData);
}
