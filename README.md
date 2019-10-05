# Memory

## Manual
Attribution: CS5610 Task details.

  * Initially all tiles will be closed with game status as yet to begin
  * Reset button and game score will only be displayed after the game begins
  * When user clicks a tile it reveals the value.
  * When a second tile is clicked, if it matches with the first tile then the match is indicated else tiles will be hidden.
  * Every click on tile will increase the score value, the lesser the score the better.
  * When all tiles match the game will display the status as WON and final score is presented.
  * User will option to reset the game while in progress and restart game after completing the game.

## Design Decisions

State from Homework4 has been modified to 
 
 state = {
   tiles = [], // tile data
   active_tiles: [], // indexes of active tiles
   completed_tiles: [], // indexes of completed tiles
   clicks: 0, //clicks to complete the game
   gameStatus: 0 //game status as in yet to start (or) in progress (or) completed
 }
 
 The state was modified considering the backend implementation and for clearing active unmatched tiles.
 This will even remove the map function to compute total score prior as from HW4.

Decision of handling delay and ignoring the clicks during delay was made to implement in client/browser side.
This decision was because we didnt have GenServer setup yet to ignore the calls and to not have additional parameters
in state for last active indication a timeout event is designed in browser side itself.

## Attributions and References
    
Course notes - http://ccs.neu.edu/home/ntuck/courses/2019/09/cs5610/
http://ccs.neu.edu/home/ntuck/courses/2019/09/cs5610/notes/08-server-state/notes.html
https://github.com/NatTuck/hangman-2019-01/tree/01-31-channel-hangman
https://elixirschool.com/en/lessons/basics/strings/
https://elixir-lang.org/docs.html
Backup Agent, Channel setup, channel calls referenced to Nats Notes - CS5610

## Server Setup

To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
