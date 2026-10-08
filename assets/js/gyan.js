// index.html — Samayik Vidhi state machine.
// data-state="idle" -> "open" on click; no slider/carousel — the Lene/Parne Ki Vidhi pill
// buttons each switch to their own slide (showing that video's thumbnail, not playing yet).
// Actual playback only starts from the separate play button.
(function () {
    var stage = document.getElementById('stage');
    var btnOpen = document.getElementById('btnOpen');
    var track = document.getElementById('scrollTrack');
    var slides = track.querySelectorAll('.gyan-slide');

    var scrollPlay = document.getElementById('scrollPlay');
    var btnPlay = document.getElementById('btnPlay');
    var btnPause = document.getElementById('btnPause');
    var btnReplay = document.getElementById('btnReplay');
    var pillButtons = document.querySelectorAll('.gyan-nav__pill-btn');

    var index = 0;

    function activeVideo() {
        var slide = slides[index];
        return slide ? slide.querySelector('video') : null;
    }

    function setPlaying(isPlaying) {
        scrollPlay.classList.toggle('is-playing', isPlaying);
    }

    function render() {
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === index);
            // only the active slide's video loads fully; the others stay unloaded (poster only)
            var video = slide.querySelector('video');
            if (video) { video.preload = (i === index) ? 'auto' : 'none'; }
        });
        pillButtons.forEach(function (btn) {
            btn.classList.toggle('is-active', Number(btn.dataset.gyanIndex) === index);
        });
    }

    function selectSlide(newIndex) {
        // leaving a slide always stops its video and resets it back to its poster/thumbnail —
        // switching slides never auto-plays, only the play button does that
        var leaving = activeVideo();
        if (leaving) {
            leaving.pause();
            leaving.currentTime = 0;
        }
        setPlaying(false);
        index = newIndex;
        render();
    }

    function open() {
        stage.setAttribute('data-state', 'open');
        // Home lives outside .stage now (fixed to the viewport corner), so it can't be shown
        // via a `.stage[data-state="open"] .btn-home` descendant selector — flag it on body
        // instead: hidden at the very start, fades in once the user has actually gone inside.
        document.body.classList.add('gyan-open');
    }

    btnOpen.addEventListener('click', open);

    pillButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            selectSlide(Number(btn.dataset.gyanIndex));
        });
    });

    btnPlay.addEventListener('click', function () {
        var video = activeVideo();
        if (!video) { return; }
        video.play();
        setPlaying(true);
    });

    btnPause.addEventListener('click', function () {
        var video = activeVideo();
        if (video) { video.pause(); }
        setPlaying(false);
    });

    btnReplay.addEventListener('click', function () {
        var video = activeVideo();
        if (!video) { return; }
        video.currentTime = 0;
        video.play();
        setPlaying(true);
    });

    // the <video> has its own native `controls` bar too, so its play/pause can also be driven
    // from there (or from a keyboard shortcut, etc.) — listening to the video's own play/pause/
    // ended events, not just our buttons' clicks, keeps the solo/pause+replay overlay in sync
    // regardless of what actually started or stopped playback.
    slides.forEach(function (slide) {
        var video = slide.querySelector('video');
        if (!video) { return; }
        video.addEventListener('play', function () { setPlaying(true); });
        video.addEventListener('pause', function () { setPlaying(false); });
        video.addEventListener('ended', function () { setPlaying(false); });
    });

    render();
})();
