export default {
  sizes: {
    test: { width: 54, height: 32 },
    microscopic: { width: 600, height: 400 },
    tiny: { width: 1750, height: 900 },
    small: { width: 4200, height: 1200 },
    medium: { width: 6400, height: 1800 },
    large: { width: 8400, height: 2400 },
  },

  layers: [
    {
      block: "air",
      //percentage
      height: 0.2,
    },
    {
      block: "dirt",
      //percentage
      height: 0.1,
    },
    {
      block: "stone",
      //percentage
      height: 0.7,
    },
  ],
};