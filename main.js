import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════
   PORTFOLIO ENGINE — CORTIZ.DEV STYLE
   GSAP Animations, ASCII Generation, Marquee
   ══════════════════════════════════════════════════════════════ */

// 1. Initial Load Animations
const initAnimations = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Hide initially
    gsap.set(['.hero-text-row span', '.navbar', '.floating-socials', '.ascii-container'], {
        opacity: 0,
        y: 30
    });

    // Animate navbar
    tl.to('.navbar', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.2
    })
    // Animate text rows
    .to('.hero-text-row span', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.1
    }, '-=1')
    // Animate ASCII
    .to('.ascii-container', {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'power2.out'
    }, '-=1.2')
    // Socials
    .to('.floating-socials', {
        opacity: 1,
        y: 0,
        duration: 1
    }, '-=1.5');
};

// 2. Continuous Marquee Animation
const initMarquee = () => {
    // Top marquee moves left
    gsap.to('.marquee-track:not(.marquee-bottom)', {
        xPercent: -50,
        ease: 'none',
        duration: 30,
        repeat: -1
    });

    // Bottom marquee moves right
    gsap.fromTo('.marquee-bottom', 
        { xPercent: -50 },
        {
            xPercent: 0,
            ease: 'none',
            duration: 40,
            repeat: -1
        }
    );
};

// Removed ASCII logic
// 4. Mouse movement interaction (parallax)
const initMouseEffect = () => {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to('.hero-text-row.text-top', {
            x: x * 2,
            y: y * 2,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.to('.hero-text-row.text-bottom', {
            x: x * -1.5,
            y: y * -1.5,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.to('.glitch-overlay', {
            x: x * 0.5,
            y: y * 0.5,
            duration: 1,
            ease: 'power2.out'
        });
    });
};

// 4.5 Audio Control (Playlist Support)
const initAudioControl = () => {
    const audio = document.getElementById('bg-audio');
    const toggleBtn = document.querySelector('.audio-toggle-btn');
    const playIcon = document.querySelector('.audio-icon-play');
    const pauseIcon = document.querySelector('.audio-icon-pause');

    if (!audio || !toggleBtn) return;

    // Playlist configuration
    const playlist = [
        "Color Your Night.mp3",
        "It's Going Down Now.mp3",
        "Last Surprise.mp3",
        "When The Moon's Reaching Out Stars -Reload-.mp3",
        "キミの記憶 -Reload-.mp3",
        "Full Moon Full Life.mp3"
    ];
    let currentTrackIndex = 0;

    let isPlaying = true; 
    audio.volume = 0.5;

    // Attempt to auto play
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        })
        .catch(error => {
            isPlaying = false;
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        });
    }

    // Toggle button handler
    toggleBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
        isPlaying = !isPlaying;
    });

    // Automatically play next track when current one ends
    audio.addEventListener('ended', () => {
        currentTrackIndex++;
        // Loop back to start if at the end
        if (currentTrackIndex >= playlist.length) {
            currentTrackIndex = 0;
        }
        
        // Update source and play
        audio.src = playlist[currentTrackIndex];
        audio.play().then(_ => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }).catch(err => console.log('Auto-play next track failed', err));
    });
};

// 5. Scroll Animations
const initScrollAnimations = () => {
    // Parallax effect for Marquee when scrolling
    gsap.to('.background-marquee', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Fade up about section titles
    gsap.from('.about-title.gs-reveal', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 75%'
        }
    });

    // Fade up about content stats
    gsap.from('.gs-fade', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 80%'
        }
    });
};

// 6. Poker Cards Hover / Fan Animation
const initPokerCards = () => {
    const cards = gsap.utils.toArray('.memory-card');
    if (cards.length === 0) return;

    // Initial state: stacked exactly together
    gsap.set(cards, {
        rotation: 0,
        y: 500,
        opacity: 0,
        transformOrigin: "bottom center"
    });

    // Scroll trigger to deal them
    ScrollTrigger.create({
        trigger: '.memories-section',
        start: 'top 60%',
        onEnter: () => {
            cards.forEach((card, index) => {
                const total = cards.length;
                const middle = Math.floor(total / 2);
                const offset = index - middle; // -3, -2, -1, 0, 1, 2, 3
                
                // Fan them out in memory block
                const rot = offset * 12; 
                const moveX = offset * 40;
                const moveY = Math.abs(offset) * 15;

                card.style.zIndex = index;

                gsap.to(card, {
                    delay: index * 0.1,
                    duration: 1.2,
                    y: moveY,
                    x: moveX,
                    rotation: rot,
                    opacity: 1,
                    ease: "back.out(1.5)"
                });
            });
        }
    });

    // Spread them more on hover
    const wrapper = document.querySelector('.cards-wrapper');
    if (wrapper) {
        wrapper.addEventListener('mouseenter', () => {
            cards.forEach((card, index) => {
                const total = cards.length;
                const middle = Math.floor(total / 2);
                const offset = index - middle;
                
                // Widen the hand
                const rot = offset * 18; 
                const moveX = offset * 70;
                const moveY = Math.abs(offset) * 20 - 20;

                gsap.to(card, {
                    duration: 0.5,
                    x: moveX,
                    y: moveY,
                    rotation: rot,
                    ease: "power2.out",
                    overwrite: 'auto'
                });
                
                // Handle individual hover to bring to front
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, { y: moveY - 30, duration: 0.3, ease: 'power1.out', overwrite: 'auto' });
                    card.style.zIndex = 100;
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { y: moveY, duration: 0.3, ease: 'power1.out', overwrite: 'auto' });
                    card.style.zIndex = index;
                });
            });
        });

        wrapper.addEventListener('mouseleave', () => {
            cards.forEach((card, index) => {
                const total = cards.length;
                const middle = Math.floor(total / 2);
                const offset = index - middle;
                
                // Back to normal spread
                const rot = offset * 12; 
                const moveX = offset * 40;
                const moveY = Math.abs(offset) * 15;

                gsap.to(card, {
                    duration: 0.5,
                    x: moveX,
                    y: moveY,
                    rotation: rot,
                    ease: "power2.out",
                    overwrite: 'auto'
                });
                card.style.zIndex = index;
            });
        });
    }
};

// Start all
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initMarquee();
    initMouseEffect();
    initAudioControl();
    initScrollAnimations();
    initPokerCards();
});
