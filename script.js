const params = new URLSearchParams(window.location.search);
const playerSize = Math.ceil(window.innerHeight / 1.66666667);

const myUuid = 'bae3bbedb75942d1ba815171048e69a8';
const steveUuid = 'c06f89064c8a49119c29ea1dbd1aab82';

const user = params.get('user') ?? steveUuid;

const userImg = new Image();
const meImg = new Image();
const presentImg = new Image();
const backgroundImg = new Image();
userImg.classList.add('image', 'user');
meImg.classList.add('image', 'me');
presentImg.classList.add('image', 'present');
backgroundImg.classList.add('background');

meImg.addEventListener('load', () => meLoaded = true);
meImg.addEventListener('animationend', () => meAnimated = true);
userImg.addEventListener('load', () => userLoaded = true);
userImg.addEventListener('animationend', () => userAnimated = true);
presentImg.addEventListener('load', () => presentLoaded = true);
backgroundImg.addEventListener('load', () => backgroundLoaded = true);

meImg.draggable = false;
userImg.draggable = false;
presentImg.draggable = false;
backgroundImg.draggable = false;

meImg.src = `https://visage.surgeplay.com/full/${playerSize}/${myUuid}`;
presentImg.src = `https://mc-heads.net/head/5b85e29f29ec9a90e482ea5b8391bcb4560bbae0dcd15d7ce1d86016b4356e98/${playerSize / 2}`;
backgroundImg.src = './bg.png';

const credit = document.createElement('a');
credit.href = 'https://planetminecraft.com/project/christmas-gingerbread-village';
credit.target = '_blank';
credit.classList.add('credit');
credit.innerHTML = 'Map Credit: <span>https://planetminecraft.com/project/christmas-gingerbread-village</span>';

const msg = document.createElement('h1');
msg.innerText = params.get('msg') || 'Merry\nChristmas!';

const giftTitle = document.getElementById('giftTitle');
const giftMsg = document.getElementById('giftMsg');
const giftLink = document.getElementById('giftLink');

const msgContainer = document.createElement('div');
msgContainer.classList.add('msg-container');
msgContainer.appendChild(msg);

const innerPresentContainer = document.createElement('div');
innerPresentContainer.classList.add('present-inner-container');
innerPresentContainer.appendChild(presentImg);

const insidePresent = document.getElementById('insidePresent');

const presentContainer = document.createElement('div');
presentContainer.classList.add('present-container');
presentContainer.appendChild(innerPresentContainer);

innerPresentContainer.addEventListener('click', (e) => {
  const location = `${e.pageX}px ${e.pageY}px`;
  insidePresent.classList.add('open');
  insidePresent.style.clipPath = `circle(0% at ${location})`;
  
  setTimeout(() => {
    insidePresent.style.clipPath = `circle(100% at ${location})`;
    credit.classList.add('opaque');
    innerPresentContainer.classList.add('open');

    setTimeout(() => {
      container.style.filter = 'blur(15px)';
      container.style.transition = 'filter 1s ease-in-out';

      setTimeout(() => {
        container.style.filter = `blur(2px)`;
      }, 3500);
    }, 100);
  }, 10);
});

const container = document.getElementById('container');

let meLoaded = false;
let meAnimated = false;
let userLoaded = false;
let userAnimated = false;
let presentLoaded = false;
let backgroundLoaded = false;
let imageLoadCheckIntervalId;
let animationFinishCheckIntervalId;

window.addEventListener('load', async () => {
  const response = await fetch(`https://api.mineatar.io/uuid/${user}`);
  const uuid = response.status === 200 ? await response.text() : steveUuid;
  const defaults = await (await fetch('./defaults.json')).json();

  for(const defUuid in defaults) {
    if(uuid !== defUuid) continue;

    console.log('Default parameters found for uuid: ', uuid);
    const defaultSet = defaults[defUuid];
    for(const defParam in defaultSet) {
      const value = defaultSet[defParam];
      params.set(defParam, value);
      console.log(`Setting ${defParam} to '${value}'`);
    }
  }

  userImg.src = `https://visage.surgeplay.com/full/${playerSize}/${uuid}`;
  container.appendChild(meImg);
  container.appendChild(userImg);

  if(params.has('hasGift')) {
    container.appendChild(presentContainer);
    giftTitle.innerText = params.get('giftTitle') || 'You got a gift!';
    giftMsg.innerText = params.get('giftMsg') || `Unfortunatly, whoever created it didn't add a message, so I guess we'll never know what it is. ☹️`;
    
    giftLink.href = params.get('giftLink') || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    giftLink.target = '_blank';
    giftLink.innerText = params.get('giftLinkText') || 'Click here to open it!';
  }else {
    document.body.removeChild(insidePresent);
  }

  imageLoadCheckIntervalId = setInterval(() => {
    if(meLoaded && userLoaded && backgroundLoaded && presentLoaded) {
      clearInterval(imageLoadCheckIntervalId);
      onAllImagesLoaded();
    }
  }, 100);

  animationFinishCheckIntervalId = setInterval(() => {
    if(meAnimated && userAnimated) {
      clearInterval(animationFinishCheckIntervalId);
      onAllPlayerAnimationsFinished();
    }
  }, 100);
});

function onAllImagesLoaded() {
  container.appendChild(backgroundImg);

  setTimeout(() => {
    container.appendChild(msgContainer);

    setTimeout(() => {
      meImg.classList.add('ready');
      userImg.classList.add('ready');

      setTimeout(() => {
        document.body.appendChild(credit);
      }, 1000);
    }, 1000);
  }, 2000);
}

function onAllPlayerAnimationsFinished() {
  presentImg.style.width = `${Math.round(meImg.getBoundingClientRect().width / 2)}px`;
  presentImg.classList.add('ready');

  innerPresentContainer.style.width = `${Math.ceil(presentImg.getBoundingClientRect().width)}px`;
  innerPresentContainer.style.height = `${Math.ceil(presentImg.getBoundingClientRect().height)}px`;

  msgContainer.classList.add('move-up');
}