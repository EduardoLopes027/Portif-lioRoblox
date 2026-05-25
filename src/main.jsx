import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const gameProjects = [
  {
    title: 'Web Strike',
    description: 'Action mechanics, movement systems, and release polish.',
    image: '/games/rush strike.webp',
    url: 'https://www.roblox.com/pt/games/16901389020/Rush-Strike',
    background: 'linear-gradient(180deg, #0d7f62 0%, #03100c 100%)',
  },
  {
    title: 'AOPG',
    description: 'Combat, effects, and optimized gameplay systems.',
    image: '/games/aopg.webp',
    url: 'https://www.roblox.com/pt/games/8396586868/AOPG',
    background: 'linear-gradient(180deg, #0ca6cf 0%, #07142a 100%)',
  },
  {
    title: 'Verse Piece',
    description: 'Anime-inspired progression systems and player experience.',
    image: '/games/verse piece.webp',
    url: 'https://www.roblox.com/pt/games/86639052909924/Verse-Piece',
    background: 'linear-gradient(180deg, #5532d6 0%, #050814 100%)',
  },
  {
    title: "Who's Lying?",
    description: 'Social guessing game with fast rounds and player interaction.',
    image: '/games/quem esta mentindo.webp',
    url: 'https://www.roblox.com/pt/games/16666497786/Whos-Lying',
    background: 'linear-gradient(180deg, #0d7f62 0%, #03100c 100%)',
  },
];

const systemProjects = [
  {
    title: 'Combat System',
    tags: ['LUA', 'RAYCAST', 'VFX'],
    video: '/games/sistema1.mp4',
    description:
      'High-performance hit detection, combo chains, and visual feedback integration.',
  },
  {
    title: 'Inventory Framework',
    tags: ['DATASTORE', 'UI', 'BACKEND'],
    video: '/games/sistema2.mp4',
    description:
      'Robust cross-server item management, trading logic, and responsive interface.',
  },
  {
    title: 'Abilities Engine',
    tags: ['MODULES', 'COOLDOWNS', 'MATH'],
    video: '/games/sistema3.mp4',
    description:
      'Modular system for easy skill creation, including cooldown management and area-of-effect logic.',
  },
  {
    title: 'Leveling Logic',
    tags: ['EXP', 'REWARDS', 'SCALING'],
    video: '/games/sistema4.mp4',
    description:
      'Dynamic progression formulas with balanced experience curves and automatic reward distribution.',
  },
];

function useMomentumScroll() {
  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const animationRef = useRef(null);
  const touchYRef = useRef(0);

  const clampScroll = useCallback((value) => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    return Math.max(0, Math.min(value, maxScroll));
  }, []);

  const animateScroll = useCallback(() => {
    const currentScroll = currentScrollRef.current;
    const targetScroll = targetScrollRef.current;
    const nextScroll = currentScroll + (targetScroll - currentScroll) * 0.095;

    if (Math.abs(targetScroll - nextScroll) < 0.35) {
      currentScrollRef.current = targetScroll;
      window.scrollTo(0, targetScroll);
      animationRef.current = null;
      return;
    }

    currentScrollRef.current = nextScroll;
    window.scrollTo(0, nextScroll);
    animationRef.current = window.requestAnimationFrame(animateScroll);
  }, []);

  const startAnimation = useCallback(() => {
    if (animationRef.current === null) {
      animationRef.current = window.requestAnimationFrame(animateScroll);
    }
  }, [animateScroll]);

  const smoothScrollTo = useCallback(
    (top) => {
      targetScrollRef.current = clampScroll(top);
      startAnimation();
    },
    [clampScroll, startAnimation],
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    currentScrollRef.current = window.scrollY;
    targetScrollRef.current = window.scrollY;

    const addScrollDelta = (delta) => {
      targetScrollRef.current = clampScroll(targetScrollRef.current + delta);
      startAnimation();
    };

    const handleWheel = (event) => {
      if (event.ctrlKey) {
        return;
      }

      event.preventDefault();
      addScrollDelta(event.deltaY * 1.08);
    };

    const handleTouchStart = (event) => {
      touchYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event) => {
      const nextTouchY = event.touches[0]?.clientY ?? touchYRef.current;
      const delta = touchYRef.current - nextTouchY;

      event.preventDefault();
      touchYRef.current = nextTouchY;
      addScrollDelta(delta * 1.15);
    };

    const handleKeyDown = (event) => {
      const keyDeltas = {
        ArrowDown: 110,
        ArrowUp: -110,
        PageDown: window.innerHeight * 0.85,
        PageUp: window.innerHeight * -0.85,
        Home: -targetScrollRef.current,
        End: document.documentElement.scrollHeight,
        ' ': event.shiftKey ? window.innerHeight * -0.85 : window.innerHeight * 0.85,
      };

      if (!(event.key in keyDeltas)) {
        return;
      }

      event.preventDefault();
      addScrollDelta(keyDeltas[event.key]);
    };

    const handleNativeScroll = () => {
      if (animationRef.current !== null) {
        return;
      }

      currentScrollRef.current = window.scrollY;
      targetScrollRef.current = window.scrollY;
    };

    const handleResize = () => {
      targetScrollRef.current = clampScroll(targetScrollRef.current);
      currentScrollRef.current = clampScroll(currentScrollRef.current);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('resize', handleResize);

      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };
  }, [clampScroll, startAnimation]);

  return smoothScrollTo;
}

function useCountUp(targetValue, shouldStart, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      return undefined;
    }

    const startTime = performance.now();

    let frameId;

    const animateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;

      setValue(Math.round(targetValue * easedProgress));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animateValue);
      }
    };

    frameId = window.requestAnimationFrame(animateValue);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [duration, shouldStart, targetValue]);

  return value;
}

function App() {
  const aboutRef = useRef(null);
  const gamesRef = useRef(null);
  const systemsRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isSystemsVisible, setIsSystemsVisible] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [systemCarouselIndex, setSystemCarouselIndex] = useState(0);
  const [isHoveringActiveCard, setIsHoveringActiveCard] = useState(false);
  const smoothScrollTo = useMomentumScroll();
  const yearsCount = useCountUp(3, isAboutVisible, 3200);
  const visitsCount = useCountUp(550, isAboutVisible, 3200);
  const gamesCount = useCountUp(4, isAboutVisible, 3200);
  const activeGameIndex =
    ((carouselIndex % gameProjects.length) + gameProjects.length) %
    gameProjects.length;
  const activeSystemIndex =
    ((systemCarouselIndex % systemProjects.length) + systemProjects.length) %
    systemProjects.length;

  const scrollToAbout = () => {
    if (aboutRef.current) {
      smoothScrollTo(aboutRef.current.offsetTop);
    }
  };

  const scrollToGames = () => {
    if (gamesRef.current) {
      smoothScrollTo(gamesRef.current.offsetTop);
    }
  };

  const scrollToSystems = () => {
    if (systemsRef.current) {
      smoothScrollTo(systemsRef.current.offsetTop);
    }
  };

  const openActiveGame = (event) => {
    const activeGame = gameProjects[activeGameIndex];
    const activeCard = event.currentTarget.querySelector(
      '.carousel-card.is-active',
    );

    if (!activeGame.url || !activeCard) {
      return;
    }

    const cardRect = activeCard.getBoundingClientRect();
    const isInsideActiveCard =
      event.clientX >= cardRect.left &&
      event.clientX <= cardRect.right &&
      event.clientY >= cardRect.top &&
      event.clientY <= cardRect.bottom;

    if (isInsideActiveCard) {
      window.open(activeGame.url, '_blank', 'noreferrer');
    }
  };

  const updateActiveCardHover = (event) => {
    const activeGame = gameProjects[activeGameIndex];
    const activeCard = event.currentTarget.querySelector(
      '.carousel-card.is-active',
    );

    if (!activeGame.url || !activeCard) {
      setIsHoveringActiveCard(false);
      return;
    }

    const cardRect = activeCard.getBoundingClientRect();

    setIsHoveringActiveCard(
      event.clientX >= cardRect.left &&
        event.clientX <= cardRect.right &&
        event.clientY >= cardRect.top &&
        event.clientY <= cardRect.bottom,
    );
  };

  useEffect(() => {
    document.fonts.ready.then(() => {
      document.body.classList.add('font-loaded');
    });
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.history.replaceState(null, '', window.location.pathname);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const aboutElement = aboutRef.current;
    const systemsElement = systemsRef.current;

    if (!aboutElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === aboutElement && entry.isIntersecting) {
            setIsAboutVisible(true);
          }
          if (entry.target === systemsElement && entry.isIntersecting) {
            setIsSystemsVisible(true);
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(aboutElement);
    if (systemsElement) {
      observer.observe(systemsElement);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll('.carousel-card');

    cards.forEach((card, index) => {
      const isActive = index === activeGameIndex;

      card.style.opacity = isActive ? '1' : '0.6';
      card.style.filter = isActive ? 'blur(0)' : 'blur(3px)';
    });
  }, [activeGameIndex]);

  return (
    <main className="page-stack">
      <section className="portfolio-shell" id="home">
        <h1>Vortex Dev</h1>
        <h3>Roblox Developer | 3 years of experience</h3>
        <div className="portfolio-actions">
          <button
            className="portfolio-button"
            type="button"
            onClick={scrollToGames}
          >
            my portfolio
          </button>
          <button
            className="portfolio-button"
            type="button"
            onClick={scrollToAbout}
          >
            about me
          </button>
        </div>
      </section>

      <section
        className={`about-section${isAboutVisible ? ' is-visible' : ''}`}
        id="about"
        ref={aboutRef}
      >
        <div className="about-tag">About</div>
        <div className="about-content">
          <h2>WHY CHOOSE ME?</h2>
          <div className="about-grid">
            <article className="about-card">
              <h4>Skilled Roblox Programmer</h4>
              <p>
                I know Roblox Studio and Lua inside out, delivering high-quality
                and efficient code.
              </p>
            </article>
            <article className="about-card">
              <h4>Gameplay & Performance</h4>
              <p>
                I focus on smooth, bug-free gameplay and efficient systems that
                enhance the player experience.
              </p>
            </article>
            <article className="about-card">
              <h4>Always Learning And Improving</h4>
              <p>
                With over 3 years of experience, I have built, optimized, and
                released everything from small scripts to complete games.
              </p>
            </article>
            <article className="about-card">
              <h4>On-Time Delivery</h4>
              <p>
                Deadlines matter. You will always know what to expect and when
                to expect it.
              </p>
            </article>
          </div>

          <div className="stats-grid" aria-label="Developer statistics">
            <article className="stat-card">
              <p>Years of experience</p>
              <strong>{yearsCount}+</strong>
            </article>
            <article className="stat-card">
              <p>Contributed visits:</p>
              <strong>{visitsCount}M+</strong>
            </article>
            <article className="stat-card">
              <p>Games I've developed</p>
              <strong>{gamesCount}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="games-section" id="games" ref={gamesRef}>
        <div className="games-content">
          <p className="section-kicker">my portfolio</p>
          <h2>Games I've Developed</h2>
          <div
            className={`carousel-scene${
              isHoveringActiveCard ? ' is-hovering-active-card' : ''
            }`}
            aria-label="3D games carousel"
            onClick={openActiveGame}
            onMouseLeave={() => setIsHoveringActiveCard(false)}
            onMouseMove={updateActiveCardHover}
          >
            <div
              className="carousel-ring"
              style={{
                '--carousel-rotation': `${-carouselIndex * 90}deg`,
              }}
            >
              {gameProjects.map((game, index) => (
                <article
                  className={`carousel-card${
                    index === activeGameIndex ? ' is-active' : ''
                  }${game.url ? ' is-clickable' : ''}`}
                  key={game.title}
                  style={{
                    '--card-bg': game.background,
                    '--card-image': `url("${game.image}")`,
                  }}
                >
                  {game.url ? (
                    <a
                      aria-label={`Open ${game.title} on Roblox`}
                      className="carousel-hitbox"
                      href={game.url}
                      rel="noreferrer"
                      target="_blank"
                    />
                  ) : null}
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="carousel-controls">
            <button
              aria-label="Previous game"
              className="carousel-button"
              type="button"
              onClick={() => setCarouselIndex((currentIndex) => currentIndex - 1)}
            >
              &lt;
            </button>
            <button
              aria-label="Next game"
              className="carousel-button"
              type="button"
              onClick={() => setCarouselIndex((currentIndex) => currentIndex + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      </section>

      <section
        className={`systems-section${isSystemsVisible ? ' is-visible' : ''}`}
        id="systems"
        ref={systemsRef}
      >
        <div className="systems-content">
          <p className="section-kicker">technical expertise</p>
          <h2>Systems by me:</h2>
          
          <div className="systems-carousel-container">
            <div 
              className="systems-carousel-track"
              style={{ transform: `translateX(-${activeSystemIndex * 100}%)` }}
            >
              {systemProjects.map((system, index) => (
                <article className="system-video-card" key={system.title}>
                  <div className="system-video-wrapper">
                    <video 
                      src={system.video} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                    />
                    <div className="system-video-overlay">
                      <div className="system-header">
                        <h3>{system.title}</h3>
                        <div className="system-tags">
                          {system.tags.map((tag) => (
                            <span className="system-tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p>{system.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="carousel-controls">
              <button
                aria-label="Previous system"
                className="carousel-button"
                type="button"
                onClick={() => setSystemCarouselIndex((prev) => prev - 1)}
              >
                &lt;
              </button>
              <button
                aria-label="Next system"
                className="carousel-button"
                type="button"
                onClick={() => setSystemCarouselIndex((prev) => prev + 1)}
              >
                &gt;
              </button>
            </div>

            <div className="systems-indicators">
              {systemProjects.map((_, index) => (
                <div 
                  key={index} 
                  className={`system-indicator${index === activeSystemIndex ? ' is-active' : ''}`}
                  onClick={() => setSystemCarouselIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-section">
        <div className="footer-content">
          <h2>Contact me</h2>
          <div className="footer-links">
            <a 
              href="https://discord.com" 
              target="_blank" 
              rel="noreferrer" 
              className="footer-link"
            >
              Discord
            </a>
            <a 
              href="https://www.roblox.com" 
              target="_blank" 
              rel="noreferrer" 
              className="footer-link"
            >
              Roblox
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer" 
              className="footer-link"
            >
              Twitter / X
            </a>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Vortex Dev. all rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
