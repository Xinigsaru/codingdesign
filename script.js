
window.addEventListener('DOMContentLoaded', () => {
    const without_avatars = document.querySelectorAll('.avatar.no-img');

    without_avatars.forEach((avatar, i) => {

        const name = avatar.parentElement.querySelector('h3').innerText;
        avatar.innerText = name.charAt(0);

        const color_code = Math.pow(name.charCodeAt(0) + i, 7).toString(12).substr(2, 6);

        avatar.style.backgroundColor = "#" + color_code;
    })
})



const navbar = document.querySelector('header');
let last_scrolled_value = 0;
const { height } = getComputedStyle(navbar);
let timer = null;

document.addEventListener('scroll', () => {
    let { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    // calculate percentage of scrolled value
    let scrolled_percent = Math.floor(scrollTop / (scrollHeight - clientHeight) * 100)
    navbar.dataset.progress = scrolled_percent + '%';

    // progress bar
    const { paddingTop, paddingBottom, height: progressHeight } = getComputedStyle(navbar, ':after');
    const progress_bar_height = parseFloat(paddingTop) + parseFloat(paddingBottom) + parseFloat(progressHeight);

    navbar.style.cssText = `--shadow: -${scrolled_percent / 100 * progress_bar_height}px;`;

    navbar.classList.toggle('show', scrolled_percent > 5 && scrolled_percent < 100);

    let new_scrolled_value = scrollTop;
    clearTimeout(timer);

    if (new_scrolled_value > parseFloat(height)) {
        if (window.matchMedia('(max-width: 650px)').matches) {
            updateNavbarPos(height);
        } else {
            updateNavbarPos('-' + height);
        }
    }

    function updateNavbarPos(position) {
        navbar.style.transform = `translateY(0)`;
        timer = setTimeout(() => {
            navbar.style.transform = `translateY(${position})`;
        }, 1500);

        navbar.style.transform = new_scrolled_value > last_scrolled_value ?
            `translateY(${position})` : "translateY(0)";
    }

    last_scrolled_value = new_scrolled_value
})

//Set The Expiry Date
let future = new Date("Jan 30, 2024 9:20:22").getTime();

function updateCountdown() {
    ////Get Present Date
    let present = new Date().getTime();

    //Time Period Between "Now" & "Countdown Date"
    let time_period = future - present;

    //Time Calculations For Days, Hours, Minutes & Seconds
    const sec = 1000,
        min = sec * 60,
        hr = min * 60,
        day = hr * 24

    let d = Math.floor(time_period / day),
        h = Math.floor((time_period % day) / hr),
        m = Math.floor((time_period % hr) / min),
        s = Math.floor((time_period % min) / sec);

    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    //Display Countdown

    document.querySelector('.day-no').innerText = d;
    document.querySelector('.hour-no').innerText = h;
    document.querySelector('.minute-no').innerText = m;
    document.querySelector('.second-no').innerText = s;


    //Update Countdown Every 1 Second
    let timer = setTimeout(updateCountdown, 1000)

    //Check Exipry Date. If Expired, Display Message	

    if (time_period < 0) {
        clearTimeout(timer);
        document.querySelector('.date').innerHTML = "<h1>EXPIRED 😭</h1>"
    }
}

updateCountdown();

const shareable_text_areas = document.querySelectorAll('.shareable-text-area'),
    share_btns = document.querySelector('.share-btns');
let selected_text;

for (shareable_text_area of shareable_text_areas) {
    shareable_text_area.addEventListener('mouseup', showShareButton)
}

function showShareButton(e) {
    selected_text = window.getSelection().toString();
    if (selected_text.length) {
        share_btns.style.cssText = `
                                left: ${e.clientX * 0.82}px;
                                top: ${e.clientY * 0.8}px;
        `;

        share_btns.classList.add('show');
    }
}

document.addEventListener('mousedown', hideShareButton);

function hideShareButton(e) {
    const share_list = ['facebook', 'twitter', 'reddit', 'whatsapp', 'duckduckgo'];

    if (share_btns.classList.contains('show') && !share_list.includes(e.target.alt)) {
        share_btns.classList.remove('show');
        window.getSelection().empty();
    }
}

share_btns.querySelectorAll('img').forEach(share_btn => {
    share_btn.addEventListener('click', shareSelectedText)
})

function shareSelectedText() {
    const text = encodeURIComponent(selected_text);
    const url = encodeURIComponent(window.location.href);
    let share_url;

    switch (this.alt) {
        case "facebook":
            share_url = `https://www.facebook.com/sharer.php?u=${url}`;
            break;
        case "twitter":
            share_url = `https://www.twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
        case "reddit":
            share_url = `https://reddit.com/submit?url=${url}&title=${text}`;
            break;
        case "whatsapp":
            share_url = `https://web.whatsapp.com/send?text=${text}%20${url}`;
            break;
        case "duckduckgo":
            share_url = `https://duckduckgo.com/?q=${text}`;
            // share_url = `https://google.com/search?q=${text}`;
            break;
    }

    window.open(share_url, "_blank");
}