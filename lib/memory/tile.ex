defmodule Memory.Tile do
  def new do
    %{
      tile_data: generate_tiles()
    }
  end

  def view(tile) do
  %{
    data: generate_tiles()
  }
  end

  def generate_tiles do
    Enum.shuffle(String.codepoints("ABCDEFGHABCDEFGH"))
  end
end