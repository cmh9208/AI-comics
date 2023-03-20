import { useState, useEffect } from "react";
import Player from "../../../../components/menu/services/Voice/Player";

function PlayerPage() {
  const [songs] = useState([
    {
      title: "Adult",
      artist: "Sondia",
      img_src: "/images/sondia_adult.png",
      src: "/music/adult.mp3",
    },
    {
      title: "Nabillera",
      artist: "Hyun-A",
      img_src: "/images/hyuna_nabillera.png",
      src: "/music/nabillera.mp3",
    }
  ]);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [nextSongIndex, setNextSongIndex] = useState(0);

  useEffect(() => {
    setNextSongIndex(() => {
      if (currentSongIndex + 1 > songs.length - 1) {
        return 0;
      } else {
        return currentSongIndex + 1;
      }
    });
  }, [currentSongIndex, songs.length]);

  return ( <div className= "PlayerPage" >
    <div className="App">
      <Player
        currentSongIndex={currentSongIndex}
        setCurrentSongIndex={setCurrentSongIndex}
        nextSongIndex={nextSongIndex}
        songs={songs}
      />
    </div>
    </div>
  );
}

export default PlayerPage;