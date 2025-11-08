// === REGISTRO DE GSAP ===
gsap.registerPlugin(ScrollTrigger);

// === CONTROL DE AUDIO (autoplay en silencio + desmutear al primer clic) ===
const audioBtn = document.getElementById('audioToggleBtn');
const bgMusic = document.getElementById('bgMusic');

// Actualiza el icono según estado
function updateAudioButton() {
  if (!audioBtn) return;
  if (bgMusic.paused) {
    audioBtn.textContent = '🔇';
  } else if (bgMusic.muted) {
    audioBtn.textContent = '🔈';
  } else {
    audioBtn.textContent = '🔊';
  }
}

// Intentar autoplay en silencio (mejor compatibilidad con políticas modernas)
async function tryAutoplayMuted() {
  if (!bgMusic) return;
  try {
    bgMusic.muted = true; // reproducir inicialmente silenciado
    await bgMusic.play();
    updateAudioButton();
  } catch (err) {
    // Autoplay bloqueado: mantenemos en pausa y el botón permitirá iniciar/reproducir
    bgMusic.pause();
    bgMusic.muted = true;
    updateAudioButton();
  }
}

// Manejador del botón: si está en pausa intenta reproducir y desmutear; si suena, alterna mute
if (audioBtn) {
  audioBtn.addEventListener('click', async () => {
    if (!bgMusic) return;

    if (bgMusic.paused) {
      // Intentar reproducir audible (al usuario inició la interacción)
      try {
        bgMusic.muted = false;
        await bgMusic.play();
      } catch (e) {
        // Si falla, intenta reproducir en silencioso y después desmutear
        try {
          bgMusic.muted = true;
          await bgMusic.play();
          bgMusic.muted = false;
        } catch (e2) {
          // sigue en pausa
        }
      }
    } else {
      // Si ya está reproduciendo, alternar mute/unmute
      bgMusic.muted = !bgMusic.muted;
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

// Intentar autoplay en silencio al cargar
tryAutoplayMuted();

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
