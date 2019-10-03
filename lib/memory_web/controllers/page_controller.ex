defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def tile_game(conn, %{"name" => name}) do
    IO.puts "==========================================="
    IO.puts name
    IO.puts "==========================================="
    render conn, "memory_tile.html", name: name
  end
end
