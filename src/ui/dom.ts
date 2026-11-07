export type Child = Node | string | null | false;

export type Attrs = Record<
  string,
  string | number | boolean | ((event: Event) => void) | undefined
>;

const isChild = (child: Child): child is Node | string =>
  child !== null && child !== false;

export const h = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tag);

  Object.entries(attrs).forEach(([name, value]) => {
    if (typeof value === 'function') {
      element.addEventListener(name.slice(2).toLowerCase(), value);
    } else if (typeof value === 'boolean') {
      element.toggleAttribute(name, value);
    } else if (value !== undefined) {
      element.setAttribute(name, String(value));
    }
  });

  element.append(...children.filter(isChild));

  return element;
};
