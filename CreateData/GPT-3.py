import openai
openai.api_key = "YOUR_API_KEY"

def generate_response(prompt):
    model_engine = "text-davinci-002" # GPT-3 모델의 ID
    response = openai.Completion.create(
      engine=model_engine,
      prompt=prompt,
      max_tokens=1024,
      n=1,
      stop=None,
      temperature=0.5,
    )
    return response.choices[0].text.strip()

while True:
    user_input = input("사용자: ")
    if user_input.lower() == "종료":
        print("챗봇: 채팅을 종료합니다.")
        break
    response = generate_response(user_input)
    print("챗봇:", response)