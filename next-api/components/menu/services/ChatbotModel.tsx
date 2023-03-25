import { useEffect, useRef, useState } from 'react'; // React Hook들을 불러옴
import axios from 'axios'; // axios를 불러옴

interface Chat { // 대화 내용의 인터페이스
  role: string; // 대화창 상단에 표시될 누가 말하는지
  content: string; // 대화 내용
}

export default function ChatbotModel() { // ChatbotModel 컴포넌트
  const [url, setUrl] = useState<string>('https://bucket-4cr3lx.s3.ap-northeast-2.amazonaws.com/'); // 비디오 파일 경로를 저장하는 State
  const [userInput, setUserInput] = useState(''); // 사용자 입력값을 저장하는 State
  const [chatHistory, setChatHistory] = useState<Chat[]>([]); // 대화 내용을 저장하는 State
  const [videoFinished, setVideoFinished] = useState(false); // 비디오 재생이 끝났는지 여부를 저장하는 State
  const videoElement = useRef<HTMLVideoElement>(null); // 비디오 엘리먼트를 저장하는 Ref
  const chatBoxRef = useRef<HTMLDivElement>(null); // 대화창 엘리먼트를 저장하는 Ref

  // 사용자 입력값이 변경될 때마다 호출되는 함수
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  // 비디오를 재생하는 함수
  const playVideo = () => {
    if (videoElement.current) {
      const playPromise = videoElement.current.play(); // 비디오 재생 시도
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // 비디오 재생 성공
            setTimeout(() => {
              // 3초 후 비디오 일시정지
              videoElement.current?.pause();
              setVideoFinished(true);
            }, 3000);
          })
          .catch((error) => {
            console.error('Failed to play video:', error);
          });
      }
    }
  };

  // 사용자 입력값을 서버에 전송하는 함수
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await axios.post('http://api.choiminho.co.kr/gpt', { user_content: userInput }); // 서버로 사용자 입력값을 전송
    const gptResponse = res.data.response; // 서버로부터 받은 GPT 모델의 응답
    const newChat = { role: 'user', content: userInput }; // 새로운 대화 내용 생성
    setChatHistory((prevChatHistory: Chat[]) => [...prevChatHistory, newChat]); // 대화 내용 State 업데이트
  
    // "답변이 작성하는 중입니다." 문구 출력
    const loadingChat = { role: 'assistant', content: '답변이 작성하는 중입니다.' };
    setChatHistory((prevChatHistory: Chat[]) => [...prevChatHistory, loadingChat]);
  
    setUserInput('');
    if (chatHistory.length === 0) { // 대화 내용이 비어있다면 (대화가 처음 시작된 경우)
      setVideoFinished(false); // 비디오 재생이 끝나지 않은 상태로 설정
      playVideo(); // 비디오 재생
    } else {
      if (videoFinished) { // 비디오 재생이 끝났다면
        setVideoFinished(false); // 비디오 재생이 끝나지 않은 상태로 설정
        playVideo(); // 비디오 재생
      }
    }
  
    // GPT 모델의 응답을 출력
    const newGptResponse = { role: 'assistant', content: gptResponse }; // 새로운 대화 내용 생성
    setTimeout(() => {
      setChatHistory((prevChatHistory: Chat[]) => [...prevChatHistory.slice(0, -1), newGptResponse]); // 대화 내용 State 업데이트
    }, 0); // 다음 렌더링 사이클에서 업데이트

  };

  useEffect(() => {
    // 대화 내용이 업데이트 될 때마다 스크롤바를 제일 아래쪽으로 이동
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <> 
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 800}}>
        <table>
          <tbody>
            <tr>
              <td style={{ width: 500, border: '1px solid black'}}>
                <div ref={chatBoxRef} style={{ height: 625, overflow: 'auto'}}>
                <h4>1. 챗봇의 답변은 문장 길이에 따라 대기 시간이 있을 수 있습니다.</h4>
                <h4>2. 아바타 영상은 우클릭하여 다운할 수 있습니다.</h4>
                <h4>3. 아래의 이모티콘을 복사하여 대화할 수 있습니다.</h4>
                <br/>
                
                <h5>이모티콘</h5>
                😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺🙂🤗🤩🤔🤨😐😑😶🙄😏
                😣😥😮🤐😯😪😫😴😛😜😝🤤😒😓😔😕🙃🤑😲☹🙁😖😞😟😤😢😭😦😧
                😨😩🤯😬😰😱🥵🥶😳🤪😵😡😠🤬😷🤒🤕🤢🤮🤧😇🤠🥳🥴🥺🤥🤫🤭🧐🤓😈
                <br/><br/>
                🍇🍈🍉🍊🍋🍌🍍🥭🍎🍏🍑🍒🍓🥝🍅🥥🥑🍆🥔🥕🌽🌶🥒🥦🍄🌰🍞🥐🥖🥯🥞
                🧀🍖🍗🥩🥓🍔🍟🍕🌭🥪🌮🌯🥙🍳🥘🍲🥣🥗🍿🧂🥫🍱🍘🍙🍚🍛🍜🍝🍠🍣🍤🍥🥮
                🥟🥠🥡🍦🍧🍨🍩🍪🎂🍰🧁🥧🍫🍬🍭🍮🍯☕🍵🍶🍾🍷🍸🍹🍺🥂🥃🥤

                ⚠🚸⛔🚫🚳🚭🚯🚱🚷📵🔞☢☣🏧🚮♿🚹🚺🚻🚼🚾🛂🛃🛄🛅
                <br/><br/>
                <h5>천자문 뜻 물어보기</h5>
                天地玄黃宇宙洪荒日月盈昃辰宿列張寒來暑往秋收冬藏閏餘成歲律呂調陽雲騰致雨露結爲霜金
                生麗水玉出崑岡劍號巨闕珠稱夜光果珍李柰菜重芥薑海鹹河淡鱗潛羽翔龍師火帝鳥官人皇始制
                文字乃服衣裳推位讓國有虞陶唐弔民伐罪周發殷湯坐朝問道垂拱平章愛育黎首臣伏戎羌遐邇壹
                體率賓歸王鳴鳳在樹白駒食場化被草木賴及萬方蓋此身髮四大五常恭惟鞠養豈敢毁傷女慕貞烈
                男效才良知過改必得能莫忘罔談彼短靡恃己張信使可覆器欲難量墨悲絲染詩讚羔羊景行維賢剋
                念作聖德建名立形端表正空谷傳聲虛堂習聽禍因堊積福緣善慶尺璧非寶寸陰是競資父事君曰嚴
                與敬孝當竭力忠則盡命臨深履薄夙興溫凊似蘭斯馨如松之盛川流不息淵澄取映容止若思言辭案
                定篤初誠美愼終宣令榮業所基籍甚無竟學優登仕攝職從政存以甘棠去而益詠樂殊貴賤禮別尊卑
                上和下睦夫唱婦隋外受傳訓入奉母儀諸姑伯叔猶子比兒孔懷兄弟同氣連枝交友投分切磨箴規仁
                慈隱惻造次弗離節義廉退顚沛匪虧性靜情逸心動神疲守眞志滿逐物意移堅持雅操好爵自靡都邑
                華夏東西二京背邙面洛浮渭據涇宮殿盤鬱樓觀飛驚圖寫禽獸畵綵仙靈丙舍倣啓甲帳對楹肆筵設
                席敲瑟吹笙陞階納陛升轉疑星右通廣內左達承明旣集墳典亦聚群英杜藁鍾隸漆書壁經府羅將相
                路俠槐卿戶封八縣家給千兵高冠陪輦驅轂振纓世綠侈富車駕肥輕策功茂實勒碑刻銘磻溪伊尹佐
                時阿衡奄宅曲阜未但孰營恒公匡合濟弱扶傾綺回漢惠說感武丁俊乂密勿多士寔寧晋楚更覇趙魏
                困橫假途滅㶁踐土會盟何遵約法韓幣煩刑起翦頗牧用軍最精宣威沙漠馳譽丹靑九州禹跡白郡秦
                幷嶽宗恒岱禪主云亭雁門紫塞鷄田赤城昆池碣石鉅野洞庭曠遠綿邈巖岫杳冥治本於農務玆稼穡
                俶載南畝我藝黍稷稅孰貢新勸賞黜陟孟軻敦素史魚秉直庶幾中庸勞謙謹勅聆音察理鑑貌辨色貽
                厥嘉猷勉其紙植省射譏誡寵增抗極殆辱近恥林皐幸卽兩疏見機解組誰逼索居閑處沈黙寂蓼求古
                尋論散慮逍遙欣奏累遺戚謝歡招渠荷的歷園莽抽條枇杷晩翠梧桐早凋陳根委翳落葉飄颻游鵾獨
                運凌摩絳霄耽讀翫市寓目囊箱易輶攸畏屬耳垣牆具膳飡飯滴口充腸飽厭烹宰飢飫糟糠親戚枯舊
                老少異糧妾御績紡侍巾帷房紈扇圓潔銀燭煒煌晝面夕寐藍筍象牀絃歌酒讌接杯擧觴矯手頓足悅
                豫且康嫡後嗣續祭祀蒸嘗稽顙再拜悚懼恐惶牋牒簡要顧答審詳骸垢想浴執熱願凉驢騾犢特駭躍
                超驤誅斬賊盜捕獲叛亡布射遼丸嵇琴阮嘯恬筆倫紙鈞巧任釣釋紛利俗竝皆佳妙毛施淑姿工嚬姸
                笑年矢每催曦暉朗曜琁璣縣斡晦魄環照指薪修祐永綏吉邵矩步引領俯仰廊廟束帶矜莊徘徊瞻眺
                孤陋寡聞愚蒙等誚謂語助者焉哉乎也
                </div>
              </td>

              <td style={{ width: 30}}></td>

              <td style={{ textAlign: 'center' }}>
                <br/><h1>GPT - 3.5</h1><br/>
                <video ref={videoElement} src={`${url}fake_ss.jpg.mp4`} style={{ width: 400}} loop muted />
                <h5>내 아바타와 대화해 보세요!</h5>
                <form onSubmit={handleSubmit}>
                  <input style={{ width: 400, height: 30}} type="text" value={userInput} onChange={handleUserInput} />
                  <br/>
                  <button style={{ width: 400, height: 30}} type="submit">Send</button>
                </form>
              </td>

              <td style={{ width: 30}}></td>
              
              <td style={{ width: 500, border: '1px solid black'}}>
                <div ref={chatBoxRef} style={{ height: 625, overflow: 'auto'}}>
                  {chatHistory.map((chat, index) => (
                    <div key={index} style={{ color: chat.role === 'user' ? '#FF6600' : 'black' }}>
                      {chat.role === 'user' ? (
                        <div>
                          <span><h3 style={{textAlign: 'center'}}>USER</h3><br/> </span>
                          {chat.content}
                        </div>
                      ) : (
                        <div style={{background: 'rgba(10, 50, 50, 0.05)'}}>
                          <span><h3 style={{textAlign: 'center'}}>GPT</h3><br/> </span>
                          {chat.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

