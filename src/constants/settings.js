export const options = {
  layout: [
    {
      value: 1,
      label: "Layout 1",
      cssClass: "layout-1"
    },
    {
      value: 2,
      label: "Layout 2",
      cssClass: "layout-2"
    },
    {
      value: 3,
      label: "Layout 3",
      cssClass: "layout-3"
    },
    {
      value: 4,
      label: "Layout 4",
      cssClass: "layout-4"
    }
  ],
  theme: [
    {
      value: 1,
      label: "Light",
      cssClass: "theme-light"
    },
    {
      value: 2,
      label: "Dark",
      cssClass: "theme-dark"
    }
  ]
};

export default {
  layout: options.layout[2],
  theme: options.theme[0],
  actionPanel: true
};
