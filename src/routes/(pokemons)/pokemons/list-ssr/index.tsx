import {
  component$,
  useComputed$,
  useSignal,
  $,
  useStore,
} from "@builder.io/qwik";
import {
  Link,
  type DocumentHead,
  routeLoader$,
  useLocation,
} from "@builder.io/qwik-city";
import type { SmallPokemon } from "~/components/interfaces";
import { PokemonImage } from "~/components/pokemons/pokemon-image";
import { Modal } from "~/components/shared";
import { GetSmallPokemons } from "~/helpers/get-small-pokemons";

export const usePokemonList = routeLoader$<SmallPokemon[]>(
  async ({ query, redirect, pathname }) => {
    const offset = Number(query.get("offset") || 0);
    if (isNaN(offset)) throw redirect(301, pathname);
    if (offset < 0) throw redirect(301, pathname);
    return await GetSmallPokemons(offset);
  }
);

export default component$(() => {
  const pokemons = usePokemonList();
  const location = useLocation();

  const modalVisible = useSignal(false);

  const modalPokemon = useStore({
    id: "",
    name: "",
  });

  const showModal = $((id: string, name: string) => {
    modalVisible.value = true;
    modalPokemon.id = id;
    modalPokemon.name = name;
  });

  const closeModal = $(() => {
    modalVisible.value = false;
  });

  const currentOffset = useComputed$<number>(() => {
    const offsetString = new URLSearchParams(location.url.search);
    return Number(offsetString.get("offset") || 0);
  });

  return (
    <>
      <div class="flex flex-col">
        <span class="my-5 text-5xl">Status</span>
        <span class="my-5 text-5xl">Pagina Actual: {currentOffset.value}</span>
        <span class="my-5 text-5xl">
          Esta cargando: {location.isNavigating ? "Si" : "No"}
        </span>
      </div>
      <div class="mt-10">
        <Link
          href={`/pokemons/list-ssr/?offset=${currentOffset.value - 10}`}
          class="btn btn-primary mr-2"
        >
          Anteriores
        </Link>
        <Link
          href={`/pokemons/list-ssr/?offset=${currentOffset.value + 10}`}
          class="btn btn-primary mr-2"
        >
          Siguientes
        </Link>
      </div>
      <div class="grid grid-cols-6 mt-5">
        {pokemons.value.map(({ name, id }) => (
          <div
            key={name}
            onClick$={() => showModal(id, name)}
            class="m-5 flex flex-col justify-center items-center"
          >
            <PokemonImage id={id} />
            <span class="capitalize">{name}</span>
          </div>
        ))}
      </div>
      <Modal persistent size="lg" showModal={modalVisible.value} close={closeModal}>
        <div q:slot="title">{modalPokemon.name}</div>
        <div q:slot="content" class="flex flex-col justify-center items-center">
          <PokemonImage id={modalPokemon.id} />
          <span>Preguntando </span>
        </div>
      </Modal>
    </>
  );
});

export const head: DocumentHead = {
  title: "SSR-List",
  meta: [
    {
      name: "description",
      content: "Pagina para SRR List",
    },
  ],
};
