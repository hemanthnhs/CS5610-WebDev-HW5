// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";
import $ from "jquery";

// Import local files
//
// Local files can be imported directly using relative paths, for example:
import socket from "./socket"
import game_init from "./starter-game";

$(() => {
  let root = $('#root')[0];
  //Socket Connection
  //Attribution : https://github.com/NatTuck/hangman-2019-01/tree/01-31-channel-hangman
  let channel = socket.channel("tiles:" + window.tileName, {});
  game_init(root, channel);
});

