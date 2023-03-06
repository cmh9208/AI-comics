from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

# KoGPT-2 모델과 Tokenizer 불러오기
model_name_or_path = "skt/kogpt2-base-v2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name_or_path)
model = GPT2LMHeadModel.from_pretrained(model_name_or_path)

# 챗봇 실행 함수
def chatbot(prompt):
    input_ids = tokenizer.encode(prompt, return_tensors='pt')
    # 모델에 입력값 전달하여 응답 생성
    output = model.generate(input_ids=input_ids, max_length=1024, pad_token_id=tokenizer.eos_token_id)
    response = tokenizer.decode(output[0], skip_special_tokens=True)
    return response

# 챗봇 실행
prompt = ""
while True:
    user_input = input("> ")
    prompt += user_input + "\n"
    response = chatbot(prompt)
    print(response)

