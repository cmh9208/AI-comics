export const analyzeNextSteps2 = (step, userResponse) => {
    return step === 0
      ? {
          purpose: "specify experience",
          message:
            "혼저옵서! 제주도라니 멋져요. 갈치조림 꼭 먹고 오세요."
        }
      : step === 1
      ? {
          purpose: "specify projects",
          message:
            "신나는 여행이 될 수 있도록 딱 맞는 음악을 추천해 드릴까요? "
        }
      : step === 2
      ? {
          purpose: "specify personality",
          message:
            "현재 기분은 어떤 상태인가요 "
        }
      : step === 3
      ? {
          purpose: "specify personality",
          message: "행복한 기분을 위해 마마무의 딩가딩가를 들려 드릴게요",
        }
      : 
       {
          purpose: "end",
          message:
            "> 당신은 충분히 잘하고 있어요. 남은 하루도 행복하게 보내길 바래요"
        }
  };
  