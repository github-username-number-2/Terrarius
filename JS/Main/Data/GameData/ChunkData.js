export default {
  //used in toDataURL(chunkImageFormat);
  //jpeg is significantly faster than png but does not allow for transparency
  chunkImageFormat: "image/png",
  //number between 0-1 (not inclusive), used in toDataURL(chunkImageFormat, chunkQuality);
  //seems to affect performance by only a couple ms but only used with lossy image formats
  chunkQuality: null,

  //decreasing chunk size decreases latency on block manipulation but increases the chances of a player manipulating several chunks simultaneously and increases file save length if chunks are saved
  //in blocks
  chunkWidth: 32,
  chunkHeight: 16,

  //this group of chunks will be loaded first, all others will be loaded as the user plays the game
  //relative to initial player position
  //[x, y, width, height]
  initialChunkLoadBox: [-10, -5, 20, 10],
};