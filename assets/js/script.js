const navSlide = () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');

  if (burger) {
    burger.addEventListener('click', () => {
      // Toggle Nav
      nav.classList.toggle('nav-active');

    })
  }
}

navSlide();

// Carousel Functionality
// Carousel Functionality
const carousels = document.querySelectorAll('.carousel-container');

carousels.forEach(container => {
  const track = container.querySelector('.carousel-track');
  const nextButton = container.querySelector('.next-btn');
  const prevButton = container.querySelector('.prev-btn');

  if (track && nextButton && prevButton) {
    const slides = Array.from(track.children);
    let currentSlideIndex = 0;

    const updateCarousel = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = 'translateX(-' + (slideWidth * currentSlideIndex) + 'px)';
    };

    const moveToSlide = (direction) => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const containerWidth = track.parentElement.clientWidth;
      // Calculate how many slides are fully visible
      const slidesVisible = Math.floor(containerWidth / slideWidth);

      // If slides are fewer than what's visible, no need to scroll
      if (slides.length <= slidesVisible) return;

      const maxIndex = slides.length - slidesVisible;

      if (direction === 'next') {
        currentSlideIndex++;
      } else {
        currentSlideIndex--;
      }

      // Bounds checking
      if (currentSlideIndex < 0) {
        currentSlideIndex = 0;
      }
      if (currentSlideIndex > maxIndex) {
        currentSlideIndex = maxIndex;
      }

      updateCarousel();
    };

    window.addEventListener('resize', () => {
      currentSlideIndex = 0;
      updateCarousel();
    });

    // Auto Scroll Logic
    if (container.classList.contains('auto-scroll')) {
      let autoScrollInterval;

      const startAutoScroll = () => {
        autoScrollInterval = setInterval(() => {
          const slideWidth = slides[0].getBoundingClientRect().width;
          const containerWidth = track.parentElement.clientWidth;
          const slidesVisible = Math.floor(containerWidth / slideWidth);
          const maxIndex = slides.length - slidesVisible;

          if (currentSlideIndex >= maxIndex) {
            currentSlideIndex = 0;
            updateCarousel();
          } else {
            moveToSlide('next');
          }
        }, 3000); // Scroll every 3 seconds
      };

      const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
      };

      startAutoScroll();

      container.addEventListener('mouseenter', stopAutoScroll);
      container.addEventListener('mouseleave', startAutoScroll);

      // Also ensure resize resets it properly? resize listener already resets to 0.
    }

    nextButton.addEventListener('click', () => {
      moveToSlide('next');
    });

    prevButton.addEventListener('click', () => {
      moveToSlide('prev');
    });
  }
});

// Hero Slider Functionality
const heroSlides = document.querySelectorAll('.hero-slide');
let currentHeroSlide = 0;

if (heroSlides.length > 0) {
  setInterval(() => {
    heroSlides[currentHeroSlide].classList.remove('active');
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    heroSlides[currentHeroSlide].classList.add('active');
  }, 5000); // Change every 5 seconds
}

// Intro Slider Functionality (Welcome Section)
const introSlider = document.querySelector('.intro-slider');
if (introSlider) {
  const introSlides = document.querySelectorAll('.intro-slide');
  const introPrevBtn = document.querySelector('.intro-prev');
  const introNextBtn = document.querySelector('.intro-next');
  const introDotsContainer = document.querySelector('.intro-slider-dots');

  if (introSlides.length > 0 && introPrevBtn && introNextBtn && introDotsContainer) {
    let currentIntroSlide = 0;
    let introAutoPlayInterval;
    const AUTO_PLAY_DELAY = 3000; // 3 seconds

    // Initialize Dots
    // Clear existing dots first to prevent duplicates if script re-runs
    introDotsContainer.innerHTML = '';
    introSlides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('intro-slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToIntroSlide(index);
        resetIntroAutoPlay();
      });
      introDotsContainer.appendChild(dot);
    });

    const introDots = document.querySelectorAll('.intro-slider-dot');

    function updateIntroSlider() {
      // Remove active class from all slides and dots
      introSlides.forEach(slide => slide.classList.remove('active'));
      introDots.forEach(dot => dot.classList.remove('active'));

      // Add active class to current slide and dot
      if (introSlides[currentIntroSlide]) {
        introSlides[currentIntroSlide].classList.add('active');
      }
      if (introDots[currentIntroSlide]) {
        introDots[currentIntroSlide].classList.add('active');
      }
    }

    function goToIntroSlide(index) {
      currentIntroSlide = index;
      updateIntroSlider();
    }

    function nextIntroSlide() {
      currentIntroSlide = (currentIntroSlide + 1) % introSlides.length;
      updateIntroSlider();
    }

    function prevIntroSlide() {
      currentIntroSlide = (currentIntroSlide - 1 + introSlides.length) % introSlides.length;
      updateIntroSlider();
    }

    // Auto Play Logic
    function startIntroAutoPlay() {
      if (introAutoPlayInterval) clearInterval(introAutoPlayInterval);
      introAutoPlayInterval = setInterval(nextIntroSlide, AUTO_PLAY_DELAY);
    }

    function stopIntroAutoPlay() {
      clearInterval(introAutoPlayInterval);
    }

    function resetIntroAutoPlay() {
      stopIntroAutoPlay();
      startIntroAutoPlay();
    }

    // Event Listeners for Buttons
    introNextBtn.addEventListener('click', () => {
      nextIntroSlide();
      resetIntroAutoPlay();
    });

    introPrevBtn.addEventListener('click', () => {
      prevIntroSlide();
      resetIntroAutoPlay();
    });

    // Pause on hover
    introSlider.parentElement.addEventListener('mouseenter', stopIntroAutoPlay);
    introSlider.parentElement.addEventListener('mouseleave', startIntroAutoPlay);

    // Initialize
    updateIntroSlider();
    startIntroAutoPlay();

    console.log('Intro slider initialized with auto-play.');
  } else {
    console.warn('Intro slider elements missing or incomplete.');
  }
}

