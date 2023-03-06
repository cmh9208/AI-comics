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