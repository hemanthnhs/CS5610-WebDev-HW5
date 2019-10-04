defmodule MemoryWeb.TilesChannel do
  use MemoryWeb, :channel

  alias Memory.Tile
  alias Memory.BackupAgent

  # Syntax reference: http://ccs.neu.edu/home/ntuck/courses/2019/09/cs5610/notes/08-server-state/notes.html
  def join("tiles:" <> name, payload, socket) do
    if authorized?(payload) do
      tile = BackupAgent.get(name) || Tile.new()
      BackupAgent.put(name, tile)
      socket = socket
      |> assign(:tile, tile)
      |> assign(:name, name)
      {:ok, %{"join" => name,"tile" => Tile.view(tile)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("select", %{"tile_id" => tile_id}, socket) do
     name = socket.assigns[:name]
     tile = Tile.select(socket.assigns[:tile],tile_id)
     socket = assign(socket, :tile, tile)
     BackupAgent.put(name, tile)
     {:reply, {:ok, %{ "tile" => Tile.view(tile)}}, socket}
  end

  def handle_in("clear_active", payload, socket) do
     name = socket.assigns[:name]
     tile = Tile.clear_active(socket.assigns[:tile])
     socket = assign(socket, :tile, tile)
     BackupAgent.put(name, tile)
     {:reply, {:ok, %{ "tile" => Tile.view(tile)}}, socket}
  end

  def handle_in("reset", payload, socket) do
     name = socket.assigns[:name]
     tile = Tile.new()
     socket = assign(socket, :tile, tile)
     BackupAgent.put(name, tile)
     {:reply, {:ok, %{ "tile" => Tile.view(tile)}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
