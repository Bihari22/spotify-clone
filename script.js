console.log ('js installing');

let currentsong = new Audio()
let songs;
let currentfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0){
        return "00:00"
    }
    const minutes = Math.floor(seconds/60);
    const remainingSeconds = Math.floor(seconds%60);

    const formattedMinutes = String(minutes).padStart(2,'0');
    const formattedSeconds = String(remainingSeconds).padStart(2,'0');
    return `${formattedMinutes} : ${formattedSeconds}`;
}

async function getsongs(folder) {
    currentfolder = folder;
    let a = await fetch(`${folder}/`)
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        } 
    }

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = ""
     for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> <img src="/Assests/svg/music.svg" alt="music">
                    <div class="songinfo">
                        <div>${song.replaceAll("%20", " ")}</div>
                        <div>Rahul</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img  class="invert" src="/Assests/svg/play.svg" alt="play now">
                    </div>
         </li>`;
     }

     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener ("click", element =>{
            playmusic(e.querySelector(".songinfo").firstElementChild.innerHTML);
        })
    })
    return songs
}

const playmusic = (track , pause=false)=>{
    currentsong.src = `/${currentfolder}/` + track
if (!pause){
    currentsong.play();
    play.src = "/Assests/svg/pause.svg"
}
    document.querySelector(".musicinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}
async function Albums() {
    let a = await fetch(`Assests/songs/`)
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0].replaceAll("%20", " ")

             let a = await fetch(`Assests/songs/${folder}/info.json`)
               let response = await a.json();
               cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
               <div class="play"><img src="/Assests/svg/gplay.svg" alt="play"></div>
               <img src="/Assests/songs/${folder}/cover.jpg" alt="smile">
               <h3 class="white">${response.title}</h3> 
               <p class="gray">${response.description}</p>
           </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{ 
        e.addEventListener("click",async item =>{
            songs = await getsongs(`Assests/songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })
    })
}
async function main(){
     songs = await getsongs("Assests/songs/honey")
    playmusic(songs[0], true)
   Albums()
    play.addEventListener("click",()=>{
        if (currentsong.paused) {
            currentsong.play()
            play.src = "/Assests/svg/pause.svg"
        } else {
            currentsong.pause()
            play.src = "/Assests/svg/play.svg"
        }
    })
        currentsong.addEventListener("timeupdate", ()=>{
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
            document.querySelector(".circle").style.left = (currentsong.currentTime)/(currentsong.duration) * 100 + "%";
        })

        document.querySelector(".seekbar").addEventListener("click", e=>{
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100 ;
            document.querySelector(".circle").style.left = percent + "%";
            currentsong.currentTime = ((currentsong.duration)*percent)/100
        })

        document.querySelector(".hamburger").firstElementChild.addEventListener("click",()=>{
            document.querySelector(".left").style.left = "0"
            document.querySelector(".left").style.transition = "all .3s"
        })
        
        document.querySelector(".close").firstElementChild.addEventListener("click", ()=>{
            document.querySelector(".left").style.left = "-100%"
            document.querySelector(".left").style.transition = "all .3s"

        })
        previous.addEventListener("click", ()=>{
            currentsong.pause()
            console.log(currentsong.src)
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
            if((index-1) >= 0){
                playmusic(songs[index-1])
            }
            else if ((index) >= 0) {
                alert("this is 1st music!!!")
                currentsong.play()
            }
        })
        next.addEventListener("click", ()=>{
            currentsong.pause()
            console.log(currentsong.src)
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
            if((index+1)< songs.length){
                playmusic(songs[index+1])
            }
            else if ((index)< songs.length){
                alert("this is last music!!!")
                currentsong.play()
            }
        })
        document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
            currentsong.volume = parseInt(e.target.value)/100
            if (currentsong.volume > 0){
                document.querySelector(".vol").src = e.target.src.replace("/Assests/svg/vol.svg","/Assests/svg/mute.svg")
            }
        else{
            document.querySelector(".vol").src = e.target.src.replace("/Assests/svg/mute.svg","/Assests/svg/vol.svg")
        }
        })

        document.querySelector(".vol>img").addEventListener("click",e=>{
            if (e.target.src.includes("/Assests/svg/vol.svg")) {
                e.target.src = e.target.src.replace("/Assests/svg/vol.svg","/Assests/svg/mute.svg")
                currentsong.volume = 0;
                document.querySelector(".vol").getElementsByTagName("input")[0].value = 0
            }
            else{
                e.target.src = e.target.src.replace("/Assests/svg/mute.svg","/Assests/svg/vol.svg")
                currentsong.volume = 1;
                document.querySelector(".vol").getElementsByTagName("input")[0].value = 100
            }
        })

      
  return songs
}

main()