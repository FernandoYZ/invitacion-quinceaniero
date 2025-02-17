<!-- src/components/BordesDecorativos.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  
  let viewportHeight = 0;
  const debounceDelay = 200;
  let timeoutId;
  let numBordes = 3;
  
  const calcularBordes = () => {
    viewportHeight = window.innerHeight;
    numBordes = Math.min(3, Math.max(1, Math.floor(viewportHeight / 500)));
  };

  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(calcularBordes, debounceDelay);
  };
  
  onMount(() => {
    calcularBordes();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  });
</script>

<div class="fixed inset-0 -z-[999] pointer-events-none">
  <!-- Fondo acuarela -->
  <div class="absolute inset-0 opacity-15">
    {#each Array(6).fill(0) as _, i}
      <img 
        src="/src/assets/img/fondo_acuarela.png" 
        class="absolute w-[30vw] h-[40vh] object-contain opacity-40"
        style={`
          left: ${i < 3 ? '-5%' : 'auto'};
          right: ${i >= 3 ? '-5%' : 'auto'};
          top: ${((i % 3 + 1) * 100) / 4}%;
        `}
        alt=""
        loading="lazy"
      />
    {/each}
  </div>

  <!-- Esquinas -->
  <div class="fixed inset-0">
    <img 
      src="/src/assets/img/esquina_1.png" 
      class="fixed top-0 left-0 w-[clamp(120px,25vw,180px)]"
      alt=""
    />
    <img 
      src="/src/assets/img/esquina_4.png" 
      class="fixed top-0 right-0 w-[clamp(120px,25vw,180px)]"
      alt=""
    />
    <img 
      src="/src/assets/img/esquina_3.png" 
      class="fixed bottom-0 left-0 w-[clamp(100px,20vw,150px)]"
      alt=""
    />
    <img 
      src="/src/assets/img/esquina_2.png" 
      class="fixed bottom-0 right-0 w-[clamp(100px,20vw,150px)]"
      alt=""
    />
  </div>

  <!-- Bordes fijos -->
  <div class="fixed inset-0">
    {#each Array(numBordes).fill(0) as _, i}
      <!-- Lado izquierdo -->
      <div 
        class="fixed left-0 w-[22vw] max-w-[220px] -translate-y-1/2"
        style={`top: ${((i + 1) * 100) / (numBordes + 1)}%`}
      >
        <img
          src="/src/assets/img/fondo_acuarela.png"
          class="absolute -z-10 w-[130%] h-full opacity-30 -translate-x-1/3"
          alt=""
        />
        <img
          src={`/src/assets/img/borde_${i + 1}.png`}
          class="w-full h-auto"
          alt=""
          loading={i > 0 ? 'lazy' : 'eager'}
        />
      </div>

      <!-- Lado derecho -->
      <div 
        class="fixed right-0 w-[22vw] max-w-[220px] -translate-y-1/2"
        style={`top: ${((i + 1) * 100) / (numBordes + 1)}%`}
      >
        <img
          src="/src/assets/img/fondo_acuarela.png"
          class="absolute -z-10 w-[130%] h-full opacity-30 translate-x-1/3"
          alt=""
        />
        <img
          src={`/src/assets/img/borde_${i + 4}.png`}
          class="w-full h-auto"
          alt=""
          loading={i > 0 ? 'lazy' : 'eager'}
        />
      </div>
    {/each}
  </div>
</div>