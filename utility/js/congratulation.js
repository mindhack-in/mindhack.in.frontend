(function () {
  window.showCongratsAnimation = function ({
    message = "🎉 Congratulations! 🎉",
  } = {}) {
    const type = ["typewriter", "glow", "bounce"];
    const animation = type[Math.floor(Math.random() * type.length)];
    console.log("Animation Type: ", animation);

    const oldOverlay = document.getElementById("mindhack-congrats");
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement("div");
    overlay.id = "mindhack-congrats";
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      display: flex; flex-direction: column; justify-content: center; align-items: center;
      font-family: 'Poppins', sans-serif; color: white;
      opacity: 0; pointer-events: none; transition: opacity 0.5s ease; z-index: 9999;
    `;

    const text = document.createElement("div");
    text.textContent = message;
    text.className = `mindhack-${animation}`;
    text.style.cssText = `
      font-size: 3em; font-weight: bold; text-align: center;
    `;
    overlay.appendChild(text);
    document.body.appendChild(overlay);

    if (!document.getElementById("mindhack-congrats-style")) {
      const style = document.createElement("style");
      style.id = "mindhack-congrats-style";
      style.textContent = `
        @keyframes mindhack-glow {
          from { text-shadow: 0 0 10px #ff0080, 0 0 20px #00ffff; }
          to { text-shadow: 0 0 30px #ff0080, 0 0 60px #00ffff; }
        }
        .mindhack-glow {
          text-shadow: 0 0 15px #ff0080, 0 0 30px #00ffff;
          animation: mindhack-glow 1.5s infinite alternate;
        }

        @keyframes mindhack-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .mindhack-bounce {
          animation: mindhack-bounce 1s infinite;
        }

        @keyframes mindhack-type {
          from { width: 0 }
          to { width: 100% }
        }
        .mindhack-typewriter {
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid white;
          width: 0;
          animation: mindhack-type 3s steps(40, end) forwards, mindhack-cursor 0.75s step-end infinite;
        }

        @keyframes mindhack-cursor {
          50% { border-color: transparent; }
        }

        @keyframes mindhack-fall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .mindhack-confetti {
          position: fixed; width: 10px; height: 10px;
          top: -10px; animation: mindhack-fall 3s linear forwards;
        }
      `;
      document.head.appendChild(style);
    }

    requestAnimationFrame(() => {
      overlay.style.opacity = 1;
      overlay.style.pointerEvents = "auto";
    });

    for (let i = 0; i < 100; i++) {
      const conf = document.createElement("div");
      conf.className = "mindhack-confetti";
      const hue = Math.random() * 360;
      conf.style.background = `hsl(${hue}, 100%, 50%)`;
      conf.style.left = Math.random() * window.innerWidth + "px";
      conf.style.animationDelay = Math.random() * 1 + "s";
      conf.style.zIndex = 9999;
      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 3500);
    }
    const audio = new Audio('../../../utility/sounds/winner.mp3');
    audio.play();
    setTimeout(() => {
      overlay.style.opacity = 0;
      setTimeout(() => overlay.remove(), 600);
    }, 4000);
  };
})();
