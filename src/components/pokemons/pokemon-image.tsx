import { component$, useSignal, useTask$ } from "@builder.io/qwik";

interface Props {
  id: number | string;
  size?: number;
  backImage?: boolean;
  isVisible?: boolean;
}
const urlDefault =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
export const PokemonImage = component$(
  ({ id, size = 200, backImage = false, isVisible = true }: Props) => {
    const imageLoaded = useSignal(true);

    useTask$(({ track }) => {
      track(() => id);
      imageLoaded.value = false;
    });

    const getUrl = () => {
      if (id === '') return '';
      if (backImage) return `${urlDefault}back/${id}.png`;
      return `${urlDefault}${id}.png`;
    };

    return (
      <div
        class="flex items-center justify-center"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <span class={{ hidden: imageLoaded.value }}>Cargando...</span>
        <img width="96" height="96"
          src={getUrl()}
          alt="Pokemon Sprite"
          style={{ width: `${size}px` }}
          onLoad$={() => (imageLoaded.value = true)}
          class={[
            {
              hidden: !imageLoaded.value,
              "brightness-0": !isVisible,
            },
            "transition-all",
          ]}
        />
      </div>
    );
  }
);
