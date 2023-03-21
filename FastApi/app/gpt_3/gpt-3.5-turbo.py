import openai
import pyttsx3


engine = pyttsx3.init()

# 음성 속도를 300으로 설정
engine.setProperty('rate', 250)

openai.api_key = "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"

messages = []

while True:


    user_content = input(f"user : ")

    messages.append({"role": "user", "content": f"{user_content}"}) # 사용자의 질문을 리스트에 추가

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)

    gpt_content = completion.choices[0].message["content"].strip() # 챗봇의 답변을 변수에 저장

    messages.append({"role": "assistant", "content": f"{gpt_content}"}) # 챗봇 답변을 리스트에 추가
    print(f"GPT : {gpt_content}") # 챗봇의 답변 출력
    engine.say(gpt_content)
    engine.stop() # 대답 출력 중지

    # 입력 속도 개선
    # 예외처리
    # 텍스트와 음성 같이 받기