(async (title, position, html, colours) => { // Genesis 9:13 — I do set my bow in the cloud, and it shall be for a token of a covenant between me and the earth.
    const h1 = document.querySelector('h1'), sleep = () => new Promise(resolve => setTimeout(resolve, time));
    await sleep(1000);
    h1.style.animation = 'none';

    while (position < 12) { html = '';
        for (let i = 0; i < colours.length; i++) {
            if (position - i > title.length)
                continue;

            if (title[position - i] != null)
                html = `<font color="${colours[i]}">${title[position - i]}</font>` + html;
        }
        position++;
        h1.innerHTML = `<a href="//13bob.net/">${title.substring(0, position - title.length - 2)}${html}${title.substring(position)}</a>`;
        await sleep(35);
    }
    h1.style.animation = 'heartbeat 1s alternate infinite';
})('13bob', 0, '', ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']);
