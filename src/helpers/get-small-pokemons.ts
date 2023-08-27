import type { PokemonListResponse, SmallPokemon } from "~/components/interfaces";

export const GetSmallPokemons = async( offset: number = 0, limit: number = 10 ) : Promise<SmallPokemon[]> => {
    const resp = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      const data = (await resp.json()) as PokemonListResponse;
      return data.results.map( ({url, name} )=> {
        const segments = url.split("/")
        const id = segments.at(-2)!
        return {
            id: id,
            name: name
        }
      });
}