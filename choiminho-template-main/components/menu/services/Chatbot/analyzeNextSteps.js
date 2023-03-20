import Link from "next/link";

export const analyzeNextSteps = (step, userResponse) => {
  // const myAudio = document.getElementById("myAudio")
  // var audio = new Audio('../../../../public/music/adult.mp3')
  // // audio.play()
    return step === 0
      ? {
          purpose: "specify experience",
          message:
            "인재를 몰라보는 곳이네요. 맞지 않았을 뿐, 틀린 게 아니에요. 자신감을 잃지 말아요"
        }
      : step === 1
      ? {
          purpose: "specify projects",
          message:
            "잘할 수 있을 거예요. 저는 항상 지혜님 편인 거 알죠? 기분이 나아질 수 있도록 딱 맞는 음악을 추천해 드릴까요?"
        }
      : step === 2
      ? {
          purpose: "specify personality",
          message:
            "현재 기분은 어떤 상태인가요"
        }
      : step === 3
      ? {
          purpose: "specify personality",
          message: "슬픈 기분을 위해 손디아의 어른을 들려 드릴게요" ,
          options:  
          //audio.play()
          //<audio src="/music/adult.mp3" autoPlay></audio>
          window.location.href = '/menu/services/voice/player'
          //링크 or modal
          
        }           
      :
       {
          purpose: "end",
          message:
            "> 당신은 충분히 잘하고 있어요. 남은 하루도 행복하게 보내길 바래요"
        }
  };
  