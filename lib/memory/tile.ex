defmodule Memory.Tile do
  def new do
    %{
      tiles: generate_tiles(),
      active_tiles: [],
      completed_tiles: [],
      clicks: 0,
      gameStatus: 0
    }
  end

  def view(tile) do
  %{
    tiles: tile.tiles,
    active_tiles: tile.active_tiles,
    completed_tiles: tile.completed_tiles,
    clicks: tile.clicks,
    gameStatus: tile.gameStatus
  }
  end

  def updated_tile_status(tiles, active_tiles, completed_tiles,tile_id) do
    case active_tiles do
        [id1]->
            if Enum.at(tiles,id1-1) == Enum.at(tiles,tile_id-1) do
                active_tiles = active_tiles ++ [tile_id]
                completed_tiles = completed_tiles ++ active_tiles
                {[],completed_tiles}
            else
                active_tiles = active_tiles ++ [tile_id]
                {active_tiles,completed_tiles}
            end
        _ ->
            active_tiles = [] ++ [tile_id]
            {active_tiles,completed_tiles}
    end
  end

  def get_gamestatus(completed_tiles) do
    if length(completed_tiles)==16 do
        2
    else
        1
    end
  end

  def select(tile,tile_id) do
    tiles= tile.tiles
    active_tiles = tile.active_tiles
    completed_tiles = tile.completed_tiles
    if Enum.member?(active_tiles++completed_tiles, tile_id) do
        %{tile | active_tiles: active_tiles, completed_tiles: completed_tiles}
    else
        {active_tiles,completed_tiles} = updated_tile_status(tiles, active_tiles, completed_tiles,tile_id)
        clicks = tile.clicks + 1
        gameStatus = get_gamestatus(completed_tiles)
        %{tile | clicks: clicks, active_tiles: active_tiles, completed_tiles: completed_tiles, gameStatus: gameStatus}
    end
  end

  def generate_tiles do
    Enum.shuffle(String.codepoints("ABCDEFGHABCDEFGH"))
  end
end