document.addEventListener('DOMContentLoaded', () => {
  // ✅ Only these exact pairs are valid:
  // socket1 + char1 → video_1.mp4, socket2 + char2 → video_2.mp4, etc.
  const playMap = {
    socket1: { char1: 'video/video_2.mp4' },
    socket2: { char2: 'video/video_1.mp4' },
    socket3: { char3: 'video/video_3.mp4' },
    socket4: { char4: 'video/video_4.mp4' },
  };

  const videoEl = document.getElementById('videoPlayer');

// Map: socket + character -> description
  const descriptionMap = {
  socket1: { char1: "Act II:   The Court or Public Square (Public Space) The action moves to a public setting where Amenaide’s letter (meant for her father) is misinterpreted as treasonous communication with the enemy, Orbassan. Tancrède arrives, but his faith in Amenaide is shaken by the accusations against her. The setting reflects growing public scrutiny and tension." },
  socket2: { char2: "Act I:   Amenaide’s Residence The opening act unfolds in Amenaide’s home, introducing her character and her secret love for Tancrède. This setting emphasizes her vulnerability and the initial intimacy of the plot.Tensions situation in the city are hinted at as the audience learns about Amenaide’s father’s allegiance and her secret correspondence." },
  socket3: { char3: "Act III:  Council Chamber Amenaide is put on trial for treason. The setting represents judgment and societal order, intensifying the stakes as her life hangs in the balance. Tancrède, torn between love and perceived betrayal, struggles with his conflicting emotions." },
  socket4: { char4: "Act IV:   The Battlefield Tancrède challenges Orbassan to a duel to defend Amenaide’s honor. The setting shifts to the martial domain, highlighting themes of chivalry and heroism." },
};

// Grab the description element
const descriptionEl = document.querySelector(".description");
  // Make characters draggable
  document.querySelectorAll('.character').forEach(char => {
    if (!char.hasAttribute('draggable')) char.setAttribute('draggable', 'true');
    char.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', char.id); // e.g. "char1"
      e.dataTransfer.effectAllowed = 'move';
    });
  });

  // Sockets accept drops, but only correct pairs will play
  document.querySelectorAll('.socket').forEach(socket => {
    socket.addEventListener('dragover', e => {
      e.preventDefault();                       // allow drop
      e.dataTransfer.dropEffect = 'move';
    });

    socket.addEventListener('drop', e => {
      e.preventDefault();
      const charId = e.dataTransfer.getData('text/plain'); // "char1"
      const socketId = socket.id;                          // "socket1"

      const src = (playMap[socketId] || {})[charId] || null;

      if (!src) {
        // ❌ Wrong pair: shake + flash red, do NOT play
        socket.classList.remove('correct');
        socket.classList.add('wrong');
        socket.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
          { duration: 250 }
        );
        setTimeout(() => socket.classList.remove('wrong'), 300);
        return;
      }

      // ✅ Correct pair: play the mapped video and snap the character in
      socket.classList.remove('wrong');
      socket.classList.add('correct');

      videoEl.pause();
      videoEl.currentTime = 0;
      videoEl.src = src;         // forward slashes!
      videoEl.load();
      videoEl.play().catch(() => { /* user can press Play if blocked */ });

      // Update description text based on the correct pair
      const desc =
      (descriptionMap[socketId] && descriptionMap[socketId][charId]) ||
        "No description available.";
      descriptionEl.textContent = desc;

      // Optional: show the dropped character inside the socket
      const charEl = document.getElementById(charId);
      if (charEl) {
        const prev = socket.querySelector('.dropped-char');
        if (prev) prev.remove();
        const clone = charEl.cloneNode(true);
        clone.classList.add('dropped-char');
        clone.removeAttribute('draggable');
        Object.assign(clone.style, {
          position: 'absolute',
          inset: '0',
          margin: 'auto',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
        });
        socket.appendChild(clone);
      }
    });
  });
});

