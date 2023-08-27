import {
  component$,
  useOnDocument,
  useTask$,
  $,
  useContext,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { PokemonImage } from "~/components/pokemons/pokemon-image";
import { PokemonListContext } from "~/context";
import { GetSmallPokemons } from "~/helpers/get-small-pokemons";



export default component$(() => {
  const pokemonState = useContext(PokemonListContext)

  useTask$(async ({ track }) => {
    track(() => pokemonState.currentPage);

    const pokemons = await GetSmallPokemons(pokemonState.currentPage * 10, 30);
    pokemonState.pokemons = [...pokemonState.pokemons, ...pokemons];
    pokemonState.isLoading = false;
  });

  useOnDocument(
    "scroll",
    $(() => {
      const maxScroll = document.body.scrollHeight;
      const currentScroll = window.scrollY + window.innerHeight;
      if (currentScroll + 200 >= maxScroll && !pokemonState.isLoading) {
        pokemonState.isLoading = true;
        pokemonState.currentPage++;
      }
    })
  );

  return (
    <>
      <div class="flex flex-col">
        <span class="my-5 text-5xl">Status</span>
        <span class="my-5 text-5xl">
          Pagina Actual: {pokemonState.currentPage}
        </span>
        <span class="my-5 text-5xl">Esta cargando: {pokemonState.isLoading}</span>
      </div>
      <div class="mt-10">
        <button
          onClick$={() => pokemonState.currentPage--}
          class="btn btn-primary mr-2"
        >
          Anteriores
        </button>
        <button
          onClick$={() => pokemonState.currentPage++}
          class="btn btn-primary mr-2"
        >
          Siguientes
        </button>
      </div>
      <div class="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 mt-5">
        {pokemonState.pokemons.map(({ name, id }) => (
          <div key={name} class="m-5 flex flex-col justify-center items-center">
            <PokemonImage id={id} />
            <span class="capitalize">{name}</span>
          </div>
        ))}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Client-List",
  meta: [
    {
      name: "description",
      content: "Pagina para Client List",
    },
  ],
};
