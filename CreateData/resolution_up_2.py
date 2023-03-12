import subprocess

input_file = 'result_gan_vid/fake_kimgoeun.mp4'
output_file = 'user_image/dd.mp4'

# 비트레이트를 8000k로 설정하여 화질을 향상시키는 방법
def a(input_file, output_file):
    subprocess.call(['ffmpeg', '-i', input_file, '-b:v', '8000k', '-c:a', 'copy', output_file])


# unsharp 필터를 적용하여 화질을 개선하는 방법
def b(input_file, output_file):
    """
    luma_msize_x : 선명도 필터링의 너비
    luma_msize_y : 선명도 필터링의 높이
    luma_amount : 선명도 필터링 강도
    chroma_msize_x : 색상 필터링의 너비
    chroma_msize_y : 색상 필터링의 높이
    chroma_amount : 색상 필터링 강도
    """
    subprocess.call(['ffmpeg', '-i', input_file, '-vf', 'unsharp=5:5:-2:5:5:-2', '-c:a', 'copy', output_file])


# 해상도 2배
def c(input_file, output_file):
    subprocess.call(['ffmpeg', '-i', input_file, '-vf', 'scale=iw*2:ih*2', '-c:a', 'copy', output_file])




if __name__ == '__main__':
    a(input_file, output_file)