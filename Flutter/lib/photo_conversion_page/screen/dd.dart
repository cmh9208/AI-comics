import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:image/image.dart' as img;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Image Upload Demo',
      home: MyHomePage(title: 'Image Upload Demo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  File? _imageFile;
  bool _isResized = false;

  Future<File?> getImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.getImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      final file = File(pickedFile.path);
      final image = img.decodeImage(file.readAsBytesSync());

      if (image!.width > 1000 || image.height > 1000) {
        final resizedImage = img.copyResize(image, width: 900);
        return File(pickedFile.path)..writeAsBytesSync(img.encodePng(resizedImage));
      } else {
        return file;
      }
    } else {
      return null;
    }
  }

  Future<String> uploadImage(File imageFile) async {
    final url = 'http://api.choiminho.co.kr/toon'; // FastAPI 엔드포인트 URL
    final request = http.MultipartRequest('POST', Uri.parse(url));

    request.files.add(await http.MultipartFile.fromPath('image', imageFile.path));

    final response = await request.send();

    if (response.statusCode == 200) {
      final responseBody = await response.stream.bytesToString();
      final decoded = jsonDecode(responseBody);
      final data = decoded['data'];
      return data;
    } else {
      throw Exception('Failed to upload image');
    }
  }

  Future<void> _getImage() async {
    final imageFile = await getImage();

    setState(() {
      _imageFile = imageFile;
      _isResized = imageFile != null && (imageFile.lengthSync() / 1024) > 1000;
    });
  }

  Future<void> _uploadImage() async {
    if (_imageFile != null) {
      final data = await uploadImage(_imageFile!);
      // data를 이미지로 디코딩하여 사용
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            if (_imageFile != null)
              Image.file(
                _imageFile!,
                height: 200,
              )
            else
              Text('이미지를 선택하세요.'),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: _getImage,
              child: Text('갤러리에서 선택'),
            ),
            SizedBox(height: 16),
            if (_isResized)
              Text(
                '이미지가 1000픽셀 이상이라 축소되었습니다.',
                style: TextStyle(color: Colors.red),
              ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: _uploadImage,
              child: Text('업로드'),
            ),
          ],
        ),
      ),
    );
  }
  }