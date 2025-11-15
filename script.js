// === REGISTRO DE GSAP ===
gsap.registerPlugin(ScrollTrigger);

// === CONTROL DE INICIO Y AUDIO ===
const startOverlay = document.getElementById('startOverlay');
const startButton = document.getElementById('startButton');
const audioBtn = document.getElementById('audioToggleBtn');
const bgMusic = document.getElementById('bgMusic');

// Configuración inicial del audio
if (bgMusic) {
    bgMusic.loop = true;
    // Pre-cargar el audio
    bgMusic.load();
    // Establecer volumen inicial
    bgMusic.volume = 1;
}

// Actualiza el icono según estado
function updateAudioButton() {
    if (!audioBtn) return;
    if (bgMusic.paused) {
        audioBtn.textContent = '▶️';
    } else {
        audioBtn.textContent = '⏸️';
    }
}

// Función para iniciar la experiencia
async function startExperience() {
    try {
        // Configurar audio
        bgMusic.currentTime = 0;
        bgMusic.volume = 1;
        bgMusic.muted = false;
        
        // Intentar reproducir con interacción del usuario
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            await playPromise;
            console.log('Música iniciada correctamente');
        }
        
        // Actualizar UI
        updateAudioButton();
        audioBtn.style.opacity = '1';
        
        // Ocultar overlay y mostrar contenido
        startOverlay.classList.add('hidden');
        document.body.classList.remove('loading');
        document.body.classList.add('ready');
        
    } catch (err) {
        console.error('Error al iniciar el audio:', err);
        // Si falla el audio, mostrar el botón para intentar de nuevo
        audioBtn.style.opacity = '1';
        updateAudioButton();
        
        // Continuar con la experiencia
        startOverlay.classList.add('hidden');
        document.body.classList.remove('loading');
        document.body.classList.add('ready');
    }
}

// Intentar reproducir audio automáticamente
async function tryAutoplay() {
    if (!bgMusic) return;
    
    try {
        // Configurar el audio antes de reproducir
        bgMusic.currentTime = 0;
        bgMusic.volume = 1;
        bgMusic.muted = false;
        
        // Intentar reproducir
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Reproducción automática exitosa');
                updateAudioButton();
            }).catch(error => {
                console.log('Autoplay inicial bloqueado, intentando en silencio:', error);
                // Intentar reproducir en silencio si falla el primer intento
                bgMusic.muted = true;
                bgMusic.play().then(() => {
                    console.log('Reproducción en silencio exitosa');
                    // Intentar desmutear después de un momento
                    setTimeout(() => {
                        bgMusic.muted = false;
                        updateAudioButton();
                    }, 1000);
                }).catch(err => {
                    console.log('Reproducción en silencio fallida:', err);
                    bgMusic.pause();
                    updateAudioButton();
                });
            });
        }
    } catch (err) {
        console.log('Error general en autoplay:', err);
        bgMusic.pause();
        updateAudioButton();
    }
}

// Manejador del botón de audio
if (audioBtn) {
    audioBtn.addEventListener('click', async () => {
        if (!bgMusic) return;

        try {
            if (bgMusic.paused) {
                // Si está pausado, intentar reproducir
                bgMusic.muted = false;
                bgMusic.volume = 1;
                await bgMusic.play();
                console.log('Reproducción iniciada por clic en botón');
            } else {
                // Si está reproduciendo, pausar
                bgMusic.pause();
                console.log('Audio pausado');
            }
        } catch (err) {
            console.error('Error al manejar el audio:', err);
        }

        updateAudioButton();
    });
}

// Ocultar/mostrar el botón en función del scroll: ocultar al bajar, mostrar al subir
let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
window.addEventListener('scroll', () => {
  const current = window.pageYOffset || document.documentElement.scrollTop;
  if (audioBtn) {
    if (current > lastScroll && current > 100) {
      // Scroll hacia abajo
      audioBtn.style.opacity = '0';
      audioBtn.style.pointerEvents = 'none';
    } else {
      // Scroll hacia arriba o cerca del top
      audioBtn.style.opacity = '1';
      audioBtn.style.pointerEvents = 'auto';
    }
  }
  lastScroll = current <= 0 ? 0 : current;
});

// Intentar reproducir audio al cargar
tryAutoplay();

// Al cargarse la página, activar las animaciones y el audio
window.addEventListener('load', () => {
  // activar animación de los cuadritos del indicador de scroll
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.classList.add('ready');
  }

  // mostrar el botón de audio y activar reproducción
  if (audioBtn) {
    setTimeout(() => {
      audioBtn.style.opacity = '1';
      audioBtn.style.pointerEvents = 'auto';
      // Intentar reproducir después de que la página esté completamente cargada
      tryAutoplay();
    }, 100);
  }
});

// Configurar eventos de inicio
document.addEventListener('DOMContentLoaded', () => {
    // Configurar el botón de inicio
    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('Botón de inicio clickeado');
            startExperience();
        });
    }

    // Ocultar el overlay si se presiona Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && startOverlay) {
            console.log('Tecla Escape presionada');
            startExperience();
        }
    });

    // Asegurarnos de que el audio esté listo
    if (bgMusic) {
        bgMusic.addEventListener('canplaythrough', () => {
            console.log('Audio listo para reproducir');
        });
    }
});

// Detectar preferencia de movimiento reducido
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// === FUNCIÓN PARA DIVIDIR TEXTO EN CARACTERES ===
function splitLetters(el) {
  if (!el) return [];
  if (el.dataset.split === 'true') return el.querySelectorAll('.char');
  
  const text = el.textContent;
  el.dataset.original = text;
  el.innerHTML = '';
  
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = text[i];
    span.style.setProperty('--i', String(i));
    el.appendChild(span);
  }
  
  el.dataset.split = 'true';
  return el.querySelectorAll('.char');
}

// === ANIMACIONES PRINCIPALES ===
if (!prefersReduced) {
  
  // Animación de fondo cósmico
  gsap.to(".cosmic-bg", {
    backgroundPosition: "100% 100%",
    duration: 20,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Animación de estrellas
  gsap.to(".stars", {
    backgroundPosition: "10000px 10000px",
    duration: 300,
    repeat: -1,
    ease: "none"
  });

  // === ANIMACIÓN DE LA IMAGEN DEL SOL (DESAPARECE AL SCROLL) ===
  const sunImageContainer = document.querySelector('.sun-image-container');
  if (sunImageContainer) {
    gsap.to(sunImageContainer, {
      opacity: 0,
      scale: 0.7,
      y: -100,
      filter: "blur(20px)",
      ease: "power2.in",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onEnter: () => {
          gsap.to(sunImageContainer, { pointerEvents: "none" });
        },
        onLeaveBack: () => {
          gsap.to(sunImageContainer, { pointerEvents: "auto" });
        }
      }
    });

    // Animación de entrada de la imagen del Sol
    gsap.fromTo(sunImageContainer,
      {
        opacity: 0,
        scale: 0.5,
        y: 50
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3
      }
    );
  }

  // === CARROUSEL: imagen del Sol interactiva ===
  (function() {
    const img = document.querySelector('.sun-image-container .sun-hero-image');
    const container = document.querySelector('.sun-image-container');
    if (!img || !container) return;

    // Lista de imágenes para el carrusel
    const images = [
      img.src, // mantener la imagen inicial
      'images/sol1.jpg',
      'images/sol2.jpg',
      'images/tierrasol.jpg'
    ];

    // Preload
    const preloaded = [];
    images.forEach((s) => {
      const im = new Image();
      im.src = s;
      preloaded.push(im);
    });

    let current = 0;
    let animating = false;
    let autoplayTimer = null;
    const AUTOPLAY_INTERVAL = 3000; // ms entre cambios automáticos

    function goToNext() {
      if (animating) return;
      animating = true;

      const next = (current + 1) % images.length;

      // aplicar clase de mini-transición
      img.classList.add('sun-image-transition');

      // cambiar la imagen a mitad de la transición para que el efecto sea suave
      setTimeout(() => {
        img.src = images[next];
        current = next;
      }, 220);

      // quitar la clase cuando termine la transición CSS
      setTimeout(() => {
        img.classList.remove('sun-image-transition');
        animating = false;
      }, 520);
    }

    // Iniciar/detener autoplay
    function startAutoplay() {
      if (autoplayTimer) return;
      autoplayTimer = setInterval(goToNext, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      if (!autoplayTimer) return;
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    // Pausar cuando el usuario interactúa
    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('touchstart', stopAutoplay);

    // Reanudar cuando termina la interacción
    container.addEventListener('mouseleave', startAutoplay);
    container.addEventListener('touchend', () => {
      // pequeña demora para evitar conflicto con el click
      setTimeout(startAutoplay, 100);
    });

    // Pausar cuando la pestaña no está visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    // avanzar al click
    img.addEventListener('click', (e) => {
      e.preventDefault();
      goToNext();
      // Reiniciar temporizador después del click
      stopAutoplay();
      startAutoplay();
    });

    // accesibilidad: también avanzar con Enter/Space cuando el contenedor tiene foco
    container.setAttribute('tabindex', '0');
    container.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.code === 'Space' || ev.key === ' ') {
        ev.preventDefault();
        goToNext();
        // Reiniciar temporizador después de avance manual
        stopAutoplay();
        startAutoplay();
      }
    });

    // Iniciar autoplay
    startAutoplay();
  })();

  // === ANIMACIÓN DEL TÍTULO PRINCIPAL ===
  const mainTitle = document.querySelector('.main-title');
  if (mainTitle) {
    const titleChars = splitLetters(mainTitle);
    
    gsap.fromTo(titleChars,
      {
        y: 100,
        rotationX: -90,
        rotationZ: gsap.utils.random(-15, 15),
        opacity: 0,
        scale: 0.7,
        transformOrigin: "50% 50%",
        filter: "blur(10px)"
      },
      {
        y: 0,
        rotationX: 0,
        rotationZ: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        stagger: {
          each: 0.03,
          from: "random"
        },
        ease: 'elastic.out(1, 0.6)',
        delay: 0.8,
        scrollTrigger: {
          trigger: mainTitle,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Pulsación del título
    gsap.to(mainTitle, {
      textShadow: "0 0 40px rgba(255,140,66,1), 0 0 60px rgba(255,200,55,0.8), 0 0 80px rgba(255,140,66,0.4)",
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Animación del resplandor del título
    gsap.fromTo(".title-glow",
      { scale: 0.8, opacity: 0 },
      { scale: 1.2, opacity: 0.4, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" }
    );
  }

  // === ANIMACIÓN DEL TEXTO INTRODUCTORIO ===
  const introText = document.querySelector('.intro-text');
  if (introText) {
    gsap.fromTo(introText,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
        rotationX: -15
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.4,
        delay: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: introText,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // === ANIMACIÓN DEL INDICADOR DE SCROLL ===
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    gsap.from(scrollIndicator, {
      opacity: 0,
      y: -20,
      duration: 1,
      delay: 2.2,
      ease: "power2.out"
    });
  }

  // === ANIMACIÓN DE CADA SECCIÓN ===
  gsap.utils.toArray(".fullscreen").forEach((section, index) => {
    if (index === 0) return; // Saltar la sección hero

    const sectionNumber = section.querySelector(".section-number");
    const h2 = section.querySelector(".section-title");

    // Animación del número de sección
    if (sectionNumber) {
      gsap.fromTo(sectionNumber,
        {
          scale: 0.5,
          opacity: 0,
          rotation: -180
        },
        {
          scale: 1,
          opacity: 0.04,
          rotation: 0,
          duration: 1.5,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animación del título de sección
    if (h2) {
      const h2Chars = splitLetters(h2);
      
      gsap.fromTo(h2Chars,
        {
          y: 80,
          opacity: 0,
          rotationY: 180,
          scale: 0.5,
          filter: "blur(10px)"
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.025,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Pulsación del título de sección
      gsap.to(h2, {
        textShadow: "0 0 30px rgba(255,140,66,1), 0 0 45px rgba(255,200,55,0.8)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Efecto parallax en la sección
    gsap.to(section, {
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });
  });

  // === ANIMACIÓN DE EXPLICACIONES DE CONCEPTOS ===
  gsap.utils.toArray('.concept-explanation').forEach((concept) => {
    gsap.fromTo(concept,
      {
        opacity: 0,
        y: 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: concept,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación del ícono
    const icon = concept.querySelector('.concept-icon');
    if (icon) {
      gsap.fromTo(icon,
        {
          scale: 0,
          rotation: -180,
          opacity: 0
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: concept,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });

  // === ANIMACIÓN DE TARJETAS DE COMPARACIÓN ===
  gsap.utils.toArray('.comparison-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 80,
        rotationX: -30,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Flotación sutil
    gsap.to(card, {
      y: -10,
      duration: 2 + (i * 0.2),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.1
    });

    // Animación del visual de la tarjeta
    const visual = card.querySelector('.card-visual');
    if (visual) {
      gsap.fromTo(visual,
        {
          scale: 0,
          rotation: -90,
          opacity: 0
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          delay: i * 0.1 + 0.3,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });

  // === ANIMACIÓN DE CAJAS DE IMPORTANCIA ===
  gsap.utils.toArray('.importance-box').forEach((box) => {
    gsap.fromTo(box,
      {
        opacity: 0,
        y: 50,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: box,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // === ANIMACIÓN DE LA DESCRIPCIÓN DEL SOL ===
  const sunDescription = document.querySelector('.sun-description');
  if (sunDescription) {
    gsap.fromTo(sunDescription,
      {
        opacity: 0,
        scale: 0.9,
        y: 50
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sunDescription,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación de elementos estadísticos
    const statItems = sunDescription.querySelectorAll('.stat-item');
    statItems.forEach((item, i) => {
      gsap.fromTo(item,
        {
          opacity: 0,
          x: -30,
          scale: 0.9
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sunDescription,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }

  // === ANIMACIÓN DE TARJETAS DE CULTURA ===
  gsap.utils.toArray('.culture-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 60,
        rotationY: -20,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación del ícono de cultura
    const icon = card.querySelector('.culture-icon');
    if (icon) {
      gsap.fromTo(icon,
        {
          scale: 0,
          rotation: -180
        },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          delay: i * 0.1 + 0.2,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });

  // === ANIMACIÓN DE LA TABLA ===
  const celestialTable = document.querySelector('.celestial-table');
  if (celestialTable) {
    gsap.fromTo(celestialTable,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: celestialTable,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación de filas de tabla
    const tableRows = celestialTable.querySelectorAll('tbody tr');
    tableRows.forEach((row, i) => {
      gsap.fromTo(row,
        {
          opacity: 0,
          x: -30
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          delay: i * 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: celestialTable,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }

  // === ANIMACIÓN DE NOTAS DE TABLA ===
  gsap.utils.toArray('.note-item').forEach((note, i) => {
    gsap.fromTo(note,
      {
        opacity: 0,
        y: 30,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: i * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: note,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // === ANIMACIÓN DE ELEMENTOS RESALTADOS ===
  gsap.utils.toArray('.highlight').forEach((highlight) => {
    gsap.to(highlight, {
      textShadow: "0 0 15px rgba(255,200,55,0.8), 0 0 25px rgba(255,200,55,0.5)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });

}

// === INTERACCIONES CON HOVER (SIEMPRE ACTIVAS) ===
document.addEventListener('DOMContentLoaded', function() {
  
  // Efecto hover en tarjetas de comparación
  const comparisonCards = document.querySelectorAll('.comparison-card');
  comparisonCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!prefersReduced) {
        gsap.to(this, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (!prefersReduced) {
        gsap.to(this, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });

  // Efecto hover en tarjetas de cultura
  const cultureCards = document.querySelectorAll('.culture-card');
  cultureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!prefersReduced) {
        gsap.to(this.querySelector('.culture-icon'), {
          rotation: 360,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    });
  });

  // Efecto hover en items de estadísticas
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      if (!prefersReduced) {
        gsap.to(this, {
          y: -5,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    
    item.addEventListener('mouseleave', function() {
      if (!prefersReduced) {
        gsap.to(this, {
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });

});

  
// === MENSAJE EN CONSOLA ===
console.log('%c🌟 El Sol: Nuestra Estrella Vital 🌟', 'font-size: 20px; font-weight: bold; color: #ff8c42;');
console.log('%cPágina creada con animaciones GSAP y ScrollTrigger', 'font-size: 14px; color: #ffc837;');

// === REPRODUCCIÓN DE AUDIO DE FONDO ===
    const boton = document.getElementById('playBtn');
    const musica = document.getElementById('bgMusic');

    boton.addEventListener('click', () => {
      musica.volume = 0.3; // volumen suave
      musica.play();
      boton.style.display = 'none'; // ocultar el botón
    });
    const mute = document.getElementById('muteBtn');

    mute.addEventListener('click', () => {
      musica.pause();
      mute.style.display = 'none';
      boton.style.display = 'block';
    });

  
// === MENSAJE EN CONSOLA ===
console.log('%c🌟 El Sol: Nuestra Estrella Vital 🌟', 'font-size: 20px; font-weight: bold; color: #ff8c42;');
console.log('%cPágina creada con animaciones GSAP y ScrollTrigger', 'font-size: 14px; color: #ffc837;');

// === ANIMACIONES TEAM DIAMANTE ===
if (!prefersReduced) {
  // Animación de las tarjetas del equipo
  gsap.utils.toArray('.team-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 80,
        rotationY: -20,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.8,
        delay: i * 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de capítulos de la historia
  gsap.utils.toArray('.story-chapter').forEach((chapter) => {
    gsap.fromTo(chapter,
      {
        opacity: 0,
        y: 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: chapter,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de tarjetas de tipos de estrellas
  gsap.utils.toArray('.star-type-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        scale: 0.8,
        y: 40
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.08,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de legacy cards
  gsap.utils.toArray('.legacy-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        x: -50,
        rotationY: -15
      },
      {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.7,
        delay: i * 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de la barra de progreso
  const phaseProgress = document.querySelector('.phase-progress');
  if (phaseProgress) {
    gsap.fromTo(phaseProgress,
      {
        width: '0%'
      },
      {
        width: '46%',
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: phaseProgress,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // Animación del box del astronauta
  gsap.utils.toArray('.astronaut-box').forEach((box) => {
    gsap.fromTo(box,
      {
        opacity: 0,
        y: 50,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: box,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de info cards
  gsap.utils.toArray('.info-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: i * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de las zonas habitables
  gsap.utils.toArray('.zone').forEach((zone, i) => {
    gsap.fromTo(zone,
      {
        opacity: 0,
        x: -30,
        scale: 0.95
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        delay: i * 0.2,
        ease: "back.out(1.3)",
        scrollTrigger: {
          trigger: zone,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de las tarjetas de planetas
  gsap.utils.toArray('.planet-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        x: -60,
        rotationY: -10
      },
      {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Efecto hover especial para planetas habitables
    if (card.classList.contains('habitable-planet')) {
      gsap.to(card, {
        boxShadow: "0 0 30px rgba(0, 255, 100, 0.3), 0 10px 40px rgba(0, 255, 100, 0.2)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: card,
          start: "top 85%"
        }
      });
    }
  });

  // Animación de tarjetas de exoplanetas
  gsap.utils.toArray('.exoplanet-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 60,
        scale: 0.9,
        rotationX: -15
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de stat boxes
  gsap.utils.toArray('.stat-box').forEach((box, i) => {
    gsap.fromTo(box,
      {
        opacity: 0,
        scale: 0.5,
        rotation: -10
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        delay: i * 0.15,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: box,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación de números contadores
    const statNumber = box.querySelector('.stat-number');
    if (statNumber) {
      const finalNumber = statNumber.textContent;
      gsap.fromTo(statNumber,
        {
          textContent: '0'
        },
        {
          textContent: finalNumber,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: box,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });

  // Animación del mission badge
  const missionBadge = document.querySelector('.mission-badge');
  if (missionBadge) {
    gsap.fromTo(missionBadge,
      {
        opacity: 0,
        scale: 0.5,
        rotation: -10
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: missionBadge,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Pulsación continua del badge
    gsap.to(missionBadge, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  // Animación de note cards
  gsap.utils.toArray('.note-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: i * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación del cosmic cycle
  const cycleSteps = document.querySelectorAll('.cycle-step');
  cycleSteps.forEach((step, i) => {
    gsap.fromTo(step,
      {
        opacity: 0,
        scale: 0.7,
        y: -20
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        delay: i * 0.2,
        ease: "back.out(1.3)",
        scrollTrigger: {
          trigger: '.cosmic-cycle',
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Efecto parallax en secciones del team
  gsap.utils.toArray('.section-team-diamante, .section-historia, .section-trappist').forEach((section) => {
    gsap.to(section, {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });
  });
}

// === INTERACCIONES ADICIONALES ===
document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scroll para el botón Team Diamante
  const teamBtn = document.querySelector('.team-diamante-btn');
  if (teamBtn) {
    teamBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Smooth scroll para los enlaces de las team cards
  document.querySelectorAll('.team-card-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Hover effects para star type cards
  document.querySelectorAll('.star-type-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!prefersReduced) {
        gsap.to(this.querySelector('.star-icon'), {
          scale: 1.3,
          rotation: 360,
          duration: 0.6,
          ease: "back.out(1.5)"
        });
      }
    });

    card.addEventListener('mouseleave', function() {
      if (!prefersReduced) {
        gsap.to(this.querySelector('.star-icon'), {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    });
  });

  // Hover effects para exoplanet cards
  document.querySelectorAll('.exoplanet-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!prefersReduced) {
        gsap.to(this.querySelector('.exoplanet-icon'), {
          scale: 1.2,
          rotation: 15,
          duration: 0.4,
          ease: "back.out(1.3)"
        });
      }
    });

    card.addEventListener('mouseleave', function() {
      if (!prefersReduced) {
        gsap.to(this.querySelector('.exoplanet-icon'), {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });
});


  
// === MENSAJE EN CONSOLA ===
console.log('%c🌟 El Sol: Nuestra Estrella Vital 🌟', 'font-size: 20px; font-weight: bold; color: #ff8c42;');
console.log('%cPágina creada con animaciones GSAP y ScrollTrigger', 'font-size: 14px; color: #ffc837;');



  
// === MENSAJE EN CONSOLA ===
console.log('%c🌟 El Sol: Nuestra Estrella Vital 🌟', 'font-size: 20px; font-weight: bold; color: #ff8c42;');
console.log('%cPágina creada con animaciones GSAP y ScrollTrigger', 'font-size: 14px; color: #ffc837;');

// === ANIMACIONES TEAM DIAMANTE ===
if (!prefersReduced) {
  // Función para animar las secciones reveladas
  function animateRevealedSections() {
    // Animación de las tarjetas del equipo
    gsap.utils.toArray('.revealed .team-card').forEach((card, i) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 80,
          rotationY: -20,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.8,
          delay: i * 0.2,
          ease: "power3.out"
        }
      );
    });

    // Animación de capítulos de la historia
    gsap.utils.toArray('.revealed .story-chapter').forEach((chapter, i) => {
      gsap.fromTo(chapter,
        {
          opacity: 0,
          y: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          delay: i * 0.1,
          ease: "power3.out"
        }
      );
    });

    // Todas las demás animaciones para secciones reveladas...
    gsap.utils.toArray('.revealed .star-type-card').forEach((card, i) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          scale: 0.8,
          y: 40
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: "back.out(1.4)"
        }
      );
    });

    gsap.utils.toArray('.revealed .legacy-card').forEach((card, i) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          x: -50,
          rotationY: -15
        },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: "power3.out"
        }
      );
    });

    const phaseProgress = document.querySelector('.revealed .phase-progress');
    if (phaseProgress) {
      gsap.fromTo(phaseProgress,
        {
          width: '0%'
        },
        {
          width: '46%',
          duration: 2,
          ease: "power2.out"
        }
      );
    }

    gsap.utils.toArray('.revealed .info-card').forEach((card, i) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 60,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out"
        }
      );
    });

    gsap.utils.toArray('.revealed .planet-card').forEach((card, i) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          x: -60,
          rotationY: -10
        },
        {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out"
        }
      );
    });

    gsap.utils.toArray('.revealed .exoplanet-card').forEach((card, i) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
          rotationX: -15
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out"
        }
      );
    });
  }

  // Observar cuando se revelan las secciones
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('revealed')) {
        animateRevealedSections();
      }
    });
  });

  // Observar cambios en las secciones ocultas
  document.querySelectorAll('.hidden-section').forEach(section => {
    observer.observe(section, { attributes: true, attributeFilter: ['class'] });
  });

  // Animación de las tarjetas del equipo (solo si ya están reveladas al cargar)
  gsap.utils.toArray('.team-card:not(.hidden-section .team-card)').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 80,
        rotationY: -20,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.8,
        delay: i * 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de capítulos de la historia (solo si ya están revelados)
  gsap.utils.toArray('.story-chapter:not(.hidden-section .story-chapter)').forEach((chapter) => {
    gsap.fromTo(chapter,
      {
        opacity: 0,
        y: 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: chapter,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de tarjetas de tipos de estrellas (solo si ya están reveladas)
  gsap.utils.toArray('.star-type-card:not(.hidden-section .star-type-card)').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        scale: 0.8,
        y: 40
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.08,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de legacy cards (solo si ya están reveladas)
  gsap.utils.toArray('.legacy-card:not(.hidden-section .legacy-card)').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        x: -50,
        rotationY: -15
      },
      {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.7,
        delay: i * 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de la barra de progreso (solo si ya está revelada)
  const phaseProgress = document.querySelector('.phase-progress:not(.hidden-section .phase-progress)');
  if (phaseProgress) {
    gsap.fromTo(phaseProgress,
      {
        width: '0%'
      },
      {
        width: '46%',
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: phaseProgress,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }

  // Animación del box del astronauta (solo si ya está revelado)
  gsap.utils.toArray('.astronaut-box:not(.hidden-section .astronaut-box)').forEach((box) => {
    gsap.fromTo(box,
      {
        opacity: 0,
        y: 50,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: box,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de info cards
  gsap.utils.toArray('.info-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: i * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de las zonas habitables
  gsap.utils.toArray('.zone').forEach((zone, i) => {
    gsap.fromTo(zone,
      {
        opacity: 0,
        x: -30,
        scale: 0.95
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        delay: i * 0.2,
        ease: "back.out(1.3)",
        scrollTrigger: {
          trigger: zone,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de las tarjetas de planetas
  gsap.utils.toArray('.planet-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        x: -60,
        rotationY: -10
      },
      {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Efecto hover especial para planetas habitables
    if (card.classList.contains('habitable-planet')) {
      gsap.to(card, {
        boxShadow: "0 0 30px rgba(0, 255, 100, 0.3), 0 10px 40px rgba(0, 255, 100, 0.2)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: card,
          start: "top 85%"
        }
      });
    }
  });

  // Animación de tarjetas de exoplanetas
  gsap.utils.toArray('.exoplanet-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 60,
        scale: 0.9,
        rotationX: -15
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación de stat boxes
  gsap.utils.toArray('.stat-box').forEach((box, i) => {
    gsap.fromTo(box,
      {
        opacity: 0,
        scale: 0.5,
        rotation: -10
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        delay: i * 0.15,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: box,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animación de números contadores
    const statNumber = box.querySelector('.stat-number');
    if (statNumber) {
      const finalNumber = statNumber.textContent;
      gsap.fromTo(statNumber,
        {
          textContent: '0'
        },
        {
          textContent: finalNumber,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: box,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  });

  // Animación del mission badge
  const missionBadge = document.querySelector('.mission-badge');
  if (missionBadge) {
    gsap.fromTo(missionBadge,
      {
        opacity: 0,
        scale: 0.5,
        rotation: -10
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: missionBadge,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Pulsación continua del badge
    gsap.to(missionBadge, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  // Animación de note cards
  gsap.utils.toArray('.note-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: i * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Animación del cosmic cycle
  const cycleSteps = document.querySelectorAll('.cycle-step');
  cycleSteps.forEach((step, i) => {
    gsap.fromTo(step,
      {
        opacity: 0,
        scale: 0.7,
        y: -20
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        delay: i * 0.2,
        ease: "back.out(1.3)",
        scrollTrigger: {
          trigger: '.cosmic-cycle',
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Efecto parallax en secciones del team
  gsap.utils.toArray('.section-team-diamante, .section-historia, .section-trappist').forEach((section) => {
    gsap.to(section, {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });
  });
}

// === INTERACCIONES ADICIONALES ===
document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scroll para el botón Team Diamante
  const teamBtn = document.querySelector('.team-diamante-btn');
  if (teamBtn) {
    teamBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Smooth scroll para los enlaces de las team cards
  document.querySelectorAll('.team-card-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Hover effects para star type cards
  document.querySelectorAll('.star-type-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!prefersReduced) {
        gsap.to(this.querySelector('.star-icon'), {
          scale: 1.3,
          rotation: 360,
          duration: 0.6,
          ease: "back.out(1.5)"
        });
      }
    });

    card.addEventListener('mouseleave', function() {
      if (!prefersReduced) {
        gsap.to(this.querySelector('.star-icon'), {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    });
  });

  // Hover effects para exoplanet cards
  document.querySelectorAll('.exoplanet-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!prefersReduced) {
        gsap.to(this.querySelector('.exoplanet-icon'), {
          scale: 1.2,
          rotation: 15,
          duration: 0.4,
          ease: "back.out(1.3)"
        });
      }
    });

    card.addEventListener('mouseleave', function() {
      if (!prefersReduced) {
        gsap.to(this.querySelector('.exoplanet-icon'), {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  });
});
// Efecto parallax en secciones del team
  gsap.utils.toArray('.section-team-diamante, .section-historia, .section-trappist, .section-final-button').forEach((section) => {
    gsap.to(section, {
      y: -60,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });
  });
  
  // Animación especial para el botón Relatos Finales
  const relatosBtn = document.querySelector('.relatos-finales-btn');
  if (relatosBtn) {
    gsap.fromTo(relatosBtn,
      {
        opacity: 0,
        scale: 0.8,
        y: 50
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.6)",
        scrollTrigger: {
          trigger: relatosBtn,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }
