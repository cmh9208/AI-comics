import 'package:dio/dio.dart';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:image_gallery_saver/image_gallery_saver.dart';

import '../../comics_making/screen/making_screen.dart';

class ConversionScreen2 extends StatefulWidget {
  @override
  _ImageUploadScreenState createState() => _ImageUploadScreenState();
}

class _ImageUploadScreenState extends State<ConversionScreen2> {
  File? _imageFile;
  String? _imageUrl;




  Future<void> _pickImage(ImageSource source) async {
    final pickedFile = await ImagePicker().pickImage(source: source);
    if (pickedFile != null) {
      setState(() {
        _imageFile = File(pickedFile.path);
        _imageUrl = null;
      });
    }
  }

  Future<void> _uploadImage() async {
    if (_imageFile == null) {
      return;
    }

    String filename = _imageFile!.path.split('/').last;
    FormData formData = FormData.fromMap({
      'image': await MultipartFile.fromFile(_imageFile!.path, filename: filename),
    });

    Dio dio = Dio();
    Response response = await dio.post('http://api.choiminho.co.kr/gan_vid_service', data: formData);

    setState(() {
      _imageFile = null;
    });

    if (response.statusCode == 200) {
      String imageUrl = response.data['url'];
      setState(() {
        _imageUrl = imageUrl;
      });
    }
  }

  Future<void> _saveImage() async {
    if (_imageUrl != null) {
      var response = await Dio().get(_imageUrl!);
      final result = await ImageGallerySaver.saveImage(
        Uint8List.fromList(response.data),
        name: 'my_image.png',
      );
      print(result);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('저장 되었습니다')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('사진변환'),
        backgroundColor: Colors.blueAccent[100],
        actions: <Widget>[
          Row(
            children: [
              IconButton(
                icon: Icon(Icons.arrow_back),
                onPressed: () {
                },
              ),
              // 이미지 추가 버튼

              // 저장 버튼
              IconButton(
                icon: Icon(Icons.save),
                onPressed: () async {
                  await _saveImage();

                },
              ),

            ],
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            if (_imageUrl != null) ...[
              Image.network(
                _imageUrl!,
                width: 400, // 원하는 너비 설정
                height: 400, // 원하는 높이 설정
                fit: BoxFit.contain,
              ),
              SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blueAccent[100],
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                        side: BorderSide(color: Colors.white),
                      ),
                    ),
                    onPressed: _saveImage,
                    child: Text('이미지 저장'),
                  ),
                  SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _imageUrl = null;
                      });
                    },
                    child: Text('이미지 삭제'),
                  ),
                ],
              ),
            ] else if (_imageFile != null) ...[
              Image.file(
                _imageFile!,
                width: 400, // 원하는 너비 설정
                height: 400, // 원하는 높이 설정
                fit: BoxFit.contain,
              ),
              SizedBox(height: 16),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent[100],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                    side: BorderSide(color: Colors.white),
                  ),
                ),
                onPressed: _uploadImage,
                child: Text('이미지 업로드'),
              ),
              SizedBox(height: 8),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent[100],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                    side: BorderSide(color: Colors.white),
                  ),
                ),
                onPressed: () => _pickImage(ImageSource.gallery),
                child: Text('갤러리에서 선택'),
              ),
              SizedBox(height: 8),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent[100],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                    side: BorderSide(color: Colors.white),
                  ),
                ),
                onPressed: () => _pickImage(ImageSource.camera),
                child: Text('카메라로 촬영'),
              ),
            ] else ...[
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent[100],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                    side: BorderSide(color: Colors.white),
                  ),
                ),
                onPressed: () => _pickImage(ImageSource.gallery),
                child: Text('갤러리에서 선택'),
              ),
              SizedBox(height: 8),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent[100],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                    side: BorderSide(color: Colors.white),
                  ),
                ),
                onPressed: () => _pickImage(ImageSource.camera),
                child: Text('카메라로 촬영'),
              ),
            ],
          ],
        ),
      ),
      bottomSheet:
      Positioned(
        left: 0,
        right: 0,
        bottom: 0,
        child: Container(
          color: Colors.blueAccent[100],
          height: 50,
          alignment: Alignment.bottomCenter, // 화면 하단 중앙에 배치
          child: Center(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                        side: BorderSide(color: Colors.white),
                      ),
                    ),
                    onPressed: () {
                    },
                    child: Text('홈 화면'),
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                        side: BorderSide(color: Colors.white),
                      ),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => ConversionScreen2()),
                      );
                    },
                    child: Text('사진변환'),
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5.0), // 버튼 R값
                        side: BorderSide(color: Colors.white),
                      ),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => MakingScreen()),
                      );

                    },
                    child: Text('만화제작'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Image Upload',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: ConversionScreen2(),
    );
  }
}
