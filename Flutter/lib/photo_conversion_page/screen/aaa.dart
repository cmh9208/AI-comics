import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';
void main() {
  runApp(ImageProcessingPage());
}
class ImageProcessingPage extends StatefulWidget {
  @override
  _ImageProcessingPageState createState() => _ImageProcessingPageState();
}

class _ImageProcessingPageState extends State<ImageProcessingPage> {
  Dio dio = Dio();
  String serverUrl = "http://api.choiminho.co.kr/image/";

  // 선택한 이미지 파일의 경로를 저장할 변수
  String? imagePath;

  // 서버로부터 받은 이미지 데이터를 저장할 변수
  Uint8List? imageData;

  // 이미지 업로드 함수
  Future<void> uploadImage() async {
    try {
      FormData formData = FormData.fromMap({
        "file": await MultipartFile.fromFile(imagePath!),
      });
      Response response = await dio.post(serverUrl, data: formData);
      setState(() {
        imageData = Uint8List.fromList(response.data['image']);
      });
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Image Processing"),
      ),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: () async {
              // 갤러리에서 이미지 선택
              var imagePicker = ImagePicker();
              var pickedImage = await imagePicker.getImage(
                source: ImageSource.gallery,
              );
              setState(() {
                imagePath = pickedImage!.path;
              });
            },
            child: Text("Choose Image"),
          ),
          if (imagePath != null) ...[
            Image.file(
              File(imagePath!),
              height: 200,
            ),
            ElevatedButton(
              onPressed: () {
                // 이미지 업로드
                uploadImage();
              },
              child: Text("Upload Image"),
            ),
            if (imageData != null) ...[
              SizedBox(height: 20),
              Text("Processed Image"),
              Image.memory(
                imageData!,
                height: 200,
              ),
            ],
          ],
        ],
      ),
    );
  }
}
