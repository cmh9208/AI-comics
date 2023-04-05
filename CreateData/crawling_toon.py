from bs4 import BeautifulSoup
import requests
import os

# https://happy-jihye.github.io/notebook/python-3/ 참고
# 크롤링하고 싶은 페이지의 개수 (네이버 웹툰은 보통 한 페이지 다 10회차 존재)

page_num = 1
n = 0
os.makedirs("data/goddess", exist_ok=True)

for i in range(page_num):
    # Webtoon Url(여신강림)
    url = "https://comic.naver.com/webtoon/list.nhn?titleId=703846&page={0}".format(i)

    # 크롤링 우회
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'}
    html = requests.get(url, headers=headers)
    result = BeautifulSoup(html.content, "html.parser")
    webtoonName = result.find("span", {"class", "wrt_nm"}).parent.get_text().strip().split('\n')

    print(webtoonName[0] + "page {0} folder created successfully!".format(i))

    title = result.findAll("td", {"class", "title"})

    for t in title:
        # 각 회차별 url
        url = "https://comic.naver.com" + t.a['href']
        # 헤더 우회해서 링크 가져오기
        html2 = requests.get(url, headers=headers)
        result2 = BeautifulSoup(html2.content, "html.parser")

        # webtoon image 찾기
        webtoonImg = result2.find("div", {"class", "wt_viewer"}).findAll("img")
        num = 1  # image_name
        for i in webtoonImg:
            n += 1

            saveName = "data/goddess" + "//" + "%s" % n + ".jpg"
            with open(saveName, "wb") as file:
                src = requests.get(i['src'], headers=headers)
                file.write(src.content)  #
            num += 1

        # 한 회차 이미지 저장 완료!
        print((t.text).strip() + "   saved completely!")













# from bs4 import BeautifulSoup  # 웹 페이지 파싱
# import requests  # HTTP 요청 보내기
# import os  # 파일 및 디렉토리 조작
#
# # 크롤링하고 싶은 페이지의 개수 (네이버 웹툰은 보통 한 페이지 다 10회차 존재)
# page_num = 1
# n = 0
#
# # 'data/goddess' 폴더 생성 (이미 폴더가 존재하는 경우, 예외가 발생하지 않음)
# os.makedirs("data/goddess", exist_ok=True)
#
# for i in range(page_num):
#     # 각 페이지의 URL 생성
#     url = "https://comic.naver.com/webtoon/list.nhn?titleId=703846&page={0}".format(i)
#
#     # 크롤링 우회를 위한 headers 설정
#     headers = {
#         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'
#     }
#     # HTTP GET 요청 보내기
#     html = requests.get(url, headers=headers)
#     # HTML 페이지 파싱
#     result = BeautifulSoup(html.content, "html.parser")
#
#     # 해당 페이지의 웹툰 제목 추출
#     webtoonName = result.find("span", {"class", "wrt_nm"}).parent.get_text().strip().split('\n')
#     print(webtoonName[0] + " page {0} folder created successfully!".format(i))
#
#     # 해당 페이지의 모든 에피소드 가져오기
#     title = result.findAll("td", {"class", "title"})
#
#     # 각 에피소드마다 실행
#     for t in title:
#         # 각 에피소드의 URL 생성
#         url = "https://comic.naver.com" + t.a['href']
#         # 크롤링 우회를 위한 headers 설정
#         html2 = requests.get(url, headers=headers)
#         # HTML 페이지 파싱
#         result2 = BeautifulSoup(html2.content, "html.parser")
#
#         # 에피소드의 이미지 추출
#         webtoonImg = result2.find("div", {"class", "wt_viewer"}).findAll("img")
#         num = 1  # 이미지 파일 이름
#
#         # 각 이미지마다 실행
#         for i in webtoonImg:
#             n += 1
#
#             # 이미지 파일 경로 및 이름 설정
#             saveName = "data/goddess" + "//" + "%s" % n + ".jpg"
#             # HTTP GET 요청 보내기
#             src = requests.get(i['src'], headers=headers)
#             # 이미지 파일로 저장
#             with open(saveName, "wb") as file:
#                 file.write(src.content)
#             num += 1
#
#         # 해당 에피소드가 완료되었다는 메시지 출력
#         print((t.text).strip() + " saved completely!")