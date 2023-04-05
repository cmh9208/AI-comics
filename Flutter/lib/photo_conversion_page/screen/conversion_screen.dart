import 'package:dio/dio.dart';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:image_gallery_saver/image_gallery_saver.dart';

class ConversionScreen extends StatefulWidget {
  @override
  _ImageUploadScreenState createState() => _ImageUploadScreenState();
}

class _ImageUploadScreenState extends State<ConversionScreen> {
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
    Response response = await dio.post(
        'http://api.choiminho.co.kr/gan_vid_service',
        data: formData);

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
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('이미지 업로드'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            if (_imageUrl != null) ...[
              Image.network(
                _imageUrl!,
                width: 100, // 원하는 너비 설정
                height: 100, // 원하는 높이 설정
                fit: BoxFit.contain,
              ),
              SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
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
                width: 100, // 원하는 너비 설정
                height: 100, // 원하는 높이 설정
                fit: BoxFit.contain,
              ),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: _uploadImage,
                child: Text('이미지 업로드'),
              ),
              SizedBox(height: 8),
              ElevatedButton(
                onPressed: () => _pickImage(ImageSource.gallery),
                child: Text('갤러리에서 선택'),
              ),
              SizedBox(height: 8),
              ElevatedButton(
                onPressed: () => _pickImage(ImageSource.camera),
                child: Text('카메라로 촬영'),
              ),
            ] else ...[
              ElevatedButton(
                onPressed: () => _pickImage(ImageSource.gallery),
                child: Text('갤러리에서 선택'),
              ),
              SizedBox(height: 8),
              ElevatedButton(
                onPressed: () => _pickImage(ImageSource.camera),
                child: Text('카메라로 촬영'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// void main() {
//   runApp(MyApp());
// }
//
// class MyApp extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'Flutter Image Upload',
//       theme: ThemeData(
//         primarySwatch: Colors.blue,
//       ),
//       home: ImageUploadScreen(),
//     );
//   }
// }
// SoketException: connection refused (OS Eroor Connection refused error= 111.) address = localhost port =50114