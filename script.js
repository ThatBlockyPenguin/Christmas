const params = new URLSearchParams(window.location.search);
const size = Math.round(window.innerHeight / 2) ?? 512;

const myUuid = 'bae3bbedb75942d1ba815171048e69a8';
const steveUuid = 'c06f89064c8a49119c29ea1dbd1aab82';

const user = params.get('user') ?? myUuid;

const userImg = new Image();
const meImg = new Image();
userImg.classList.add('image', 'user');
meImg.classList.add('image', 'me');

meImg.addEventListener('load', () => meLoaded = true);
userImg.addEventListener('load', () => userLoaded = true);

meImg.src = `https://visage.surgeplay.com/full/${size}/${myUuid}`;

let meLoaded = false;
let userLoaded = false;
let intervalId;

window.addEventListener('load', async () => {
  const response = await (await fetch(`https://api.mineatar.io/uuid/${user}`));
  const uuid = response.status === 200 ? await response.text() : steveUuid;

  userImg.src = `https://visage.surgeplay.com/full/${size}/${uuid}`;
  document.body.appendChild(meImg);
  document.body.appendChild(userImg);

  intervalId = setInterval(() => {
    if(meLoaded && userLoaded) {
      clearInterval(intervalId);
      onBothImagesLoaded();
    }
  }, 100);
});

function onBothImagesLoaded() {
  meImg.classList.add('ready');
  userImg.classList.add('ready');
}