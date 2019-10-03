defmodule Memory.Tile do
  def new do
    %{
      tiles: generate_tiles(),
      active_tiles: [],
      completed_tiles: [],
      clicks: 0
    }
  end

  def view(tile) do
  %{
    tiles: tile.tiles,
    active_tiles: tile.active_tiles,
    completed_tiles: tile.completed_tiles,
    clicks: tile.clicks
  }
  end

  def select(tile,tile_id) do
    active_tiles = tile.active_tiles
    |> MapSet.new()
    |> MapSet.put(tile_id)
    |> MapSet.to_list
    clicks = tile.clicks + 1
     %{tile | clicks: clicks, active_tiles: active_tiles}
  end

  def generate_tiles do
    Enum.shuffle(String.codepoints("ABCDEFGHABCDEFGH"))
  end
end