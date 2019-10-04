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

The app state is stored as a single variable { 0 : { letter : 'D', status : 'hide', count : 0}, 1 : {...}, ....}.
Where each key has a letter stored with its alphabet, status variable indicating the status of tile.
Status includes 'hide', 'active' and 'completed'. This will be used to derive other information of the game
like game complete. Another variable count is to keep the track of number of times this tile is clicked.
Each tile count is summed to obtain the total score of the game. Onclick event is developed to properly update the state
and necessary changes will be made.

The decisions related to usage convenience were made to have styles properly to understand various tiles and the game 
information like score and the button to reset is only provided after the game begins.

## Attributions and References
    
Course notes - http://ccs.neu.edu/home/ntuck/courses/2019/09/cs5610/
http://ccs.neu.edu/home/ntuck/courses/2019/09/cs5610/notes/08-server-state/notes.html
https://github.com/NatTuck/hangman-2019-01/tree/01-31-channel-hangman
https://elixirschool.com/en/lessons/basics/strings/

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
