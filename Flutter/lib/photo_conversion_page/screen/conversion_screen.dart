import 'dart:convert';
import 'dart:io';
import 'package:ai_comics/main_page/screen/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
// 갤러리에 이미지 저장을 위한 패키지
import 'package:path_provider/path_provider.dart';
import 'package:image_gallery_saver/image_gallery_saver.dart';

import '../../comics_making/screen/making_screen.dart';

class ConversionScreen extends StatefulWidget {
  @override
  _ConversionScreenState createState() => _ConversionScreenState();
}

class _ConversionScreenState extends State<ConversionScreen> {
  File? _imageFile;
  String? _imageUrl;

  Future<void> _pickImage(ImageSource source) async {
    final pickedFile = await ImagePicker().pickImage(source: source);
    setState(() {
      _imageFile = File(pickedFile!.path);
    });

    // 이미지를 서버로 전송
    final response = await http.post(
      Uri.parse('http://api.choiminho.co,kr/upload-image'),
      body: {'file': http.MultipartFile.fromBytes('file', _imageFile!.readAsBytesSync(), filename: 'image.png')},
    );
    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      setState(() {
        _imageUrl = responseData['url'];
      });

      // 변환성공 문구 출력
      showDialog(
        context: context,
        builder: (context) =>
            AlertDialog(
              title: Text(
                '이미지 변환 완료',
                  style: TextStyle(
                      color: Colors.white
                  ),
              ),
              content: Text(
                '이미지 변환이 성공적으로 완료되었습니다.',
                  style: TextStyle(
                      color: Colors.white
                  ),
              ),
              actions: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    _saveImageToGallery();
                  },
                  child: Text(
                    '저장',
                      style: TextStyle(
                          color: Colors.white
                      ),
                  ),
                ),
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                    '취소',
                      style: TextStyle(
                          color: Colors.white
                      ),
                  ),
                ),
              ],
            ),
      );
    } else {
      // 변환실패 문구 출력
      showDialog(
        context: context,
        builder: (context) =>
            AlertDialog(
              title: Text(
                  '이미지 변환 실패',
                  style: TextStyle(
                      color: Colors.black
                  ),
              ),
              content: Text(
                  '이미지 변환이 실패하였습니다. 다시 시도해주세요.',
                  style: TextStyle(
                      color: Colors.black
                  ),
              ),
              actions: [
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                  '확인',
                      style: TextStyle(
                          color: Colors.black
                      ),
                  ),
                ),
              ],
            ),
      );
    }
  }

  Future<void> _saveImageToGallery() async {
    final response = await http.get(Uri.parse(_imageUrl!));
    final bytes = response.bodyBytes;
    final directory = await getExternalStorageDirectory();
    final file = File('${directory!.path}/${DateTime
        .now()
        .millisecondsSinceEpoch}.jpg');
    await file.writeAsBytes(bytes);

    final result = await ImageGallerySaver.saveImage(bytes);
    if (result['isSuccess']) {
      // 저장 성공 문구 출력
      showDialog(
        context: context,
        builder: (context) =>
            AlertDialog(
              title: Text(
                  '이미지 저장 완료',
                  style: TextStyle(
                      color: Colors.black
                  ),
              ),
              content: Text(
                  '이미지 저장이 성공적으로 완료되었습니다.',
                  style: TextStyle(
                      color: Colors.black
                  ),
              ),
              actions: [
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                      style: TextStyle(
                          color: Colors.black
                      ), '확인'),
                ),
              ],
            ),
      );
    } else {
      // 저장 실패 문구 출력
      showDialog(
        context: context,
        builder: (context) =>
            AlertDialog(
              title: Text(
                  '이미지 저장 실패',
                  style: TextStyle(
                      color: Colors.black
                  ),
              ),
              content: Text(
                  '이미지 저장이 실패하였습니다. 다시 시도해주세요.',
                  style: TextStyle(
                      color: Colors.black
                  ),
              ),
              actions: [
                ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                  '확인',
                      style: TextStyle(
                          color: Colors.black
                      ),
                  ),
                ),
              ],
            ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Image Picker Example'),
      ),
      body: Stack(
        children: [
          Center(
            child: ColorFiltered(
              colorFilter: ColorFilter.mode(Colors.white.withOpacity(1), BlendMode.dstATop),
              child: Image.asset('assets/images/home_background/ggg.png'),
            ),
          ),
          Container(
            color: Colors.transparent,
            alignment: Alignment.center,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (_imageFile != null)
                  Image.file(
                    _imageFile!,
                    height: 200,
                  ),
                if (_imageUrl != null)
                  Image.network(
                    _imageUrl!,
                    height: 200,
                  ),
                if (_imageUrl == null && _imageFile != null)
                  Text(
                    '서버 연결 실패.',
                    style: TextStyle(color: Colors.white),
                  ),
                if (_imageUrl == null && _imageFile == null)
                  Text(
                    '아직 변환된 이미지가 없습니다 \n 이미지 선택 시 변환이 진행 됩니다.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white),
                  ),
                SizedBox(height: 20),
                Container(
                  width: 150,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5.0),
                        side: BorderSide(color: Colors.white),
                      ),
                    ),
                    onPressed: () => _pickImage(ImageSource.gallery),
                    child: Text('이미지 선택'),
                  ),
                ),
                if (_imageUrl != null) SizedBox(height: 20),
                Container(
                  width: 150,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5.0),
                        side: BorderSide(color: Colors.white),
                      ),
                    ),
                    onPressed: _saveImageToGallery,
                    child: Text('변환된 이미지 저장'),
                  ),
                ),
              ],
            ),
          ),
          // 하단 메뉴 바
          Stack(
            alignment: Alignment.center,
            children: [
             Positioned(
              left: 0,
              right: 0,
              bottom: 0,
               child: Column(
                 mainAxisAlignment: MainAxisAlignment.center,
                 children: [
                  Container(
                    alignment: Alignment.center,
                    height: 50,
                    color: Colors.black.withOpacity(0.5),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                          Padding(
                            padding: const EdgeInsets.all(10.0),
                            child: Container(
                              width: 85,
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
                                    MaterialPageRoute(builder: (context) => Home()),
                                  );
                                },
                                child: Text('홈 화면'),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(10.0),
                            child: Container(
                              width: 85,
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
                          ),
                          Padding(
                            padding: const EdgeInsets.all(10.0),
                            child: Container(
                              width: 85,
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
                                    MaterialPageRoute(builder: (context) => Home()),
                                  );
                                },
                                child: Text('만화감상'),
                              ),
                            ),
                          ),
                      ],
                    ),
                   ),
                  ],
               ),
             ),
            ],
          ),
        ],
      ),
    );
  }
}