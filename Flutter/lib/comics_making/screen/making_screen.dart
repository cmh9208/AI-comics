import 'dart:async';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:ai_comics/main_page/screen/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:image_gallery_saver/image_gallery_saver.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

import '../../comics_deco/screen/deco_screen.dart';
import '../../photo_conversion_page/screen/conversion_screen.dart';

class MakingScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Image Gallery',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Screen(),
    );
  }
}

class Screen extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<Screen> {
  final GlobalKey _globalKey = GlobalKey();
  List<File> _images = [];

  Future<void> _saveImage() async {
    RenderRepaintBoundary boundary =
    _globalKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
    ui.Image image = await boundary.toImage();
    ByteData? byteData =
    await image.toByteData(format: ui.ImageByteFormat.png);
    Uint8List pngBytes = byteData!.buffer.asUint8List();
    await ImageGallerySaver.saveImage(pngBytes, quality: 100);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('이미지가 저장되었습니다!'),
      ),
    );
  }

  void _pickImage() async {
    final imagePicker = ImagePicker();
    final pickedImage =
    await imagePicker.pickImage(source: ImageSource.gallery);
    setState(() {
      if (pickedImage != null) {
        _images.add(File(pickedImage.path));
      }
    });
  }

  Future<ui.Image> _getImage(File image) async {
    final data = await image.readAsBytes();
    final completer = Completer<ui.Image>();
    ui.decodeImageFromList(data, (ui.Image img) {
      return completer.complete(img);
    });
    return completer.future;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('만화제작'),
        backgroundColor: Colors.pinkAccent[100],
        actions: <Widget>[
          Row(
            children: [
              IconButton(
                icon: Icon(Icons.arrow_back),
                onPressed: () {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (context) => MakingScreen()),
                        (route) => false,
                  );
                },
              ),
              // 이미지 추가 버튼
              IconButton(
                onPressed: _pickImage,
                tooltip: 'Pick Image',
                icon: Icon(Icons.add_photo_alternate),
              ),
              // 저장 버튼
              IconButton(
                icon: Icon(Icons.save),
                onPressed: () async {
                  if (_images.isNotEmpty) {
                    await _saveImage();
                    setState(() {
                      _images.clear();
                    });
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('저장할 이미지가 없습니다!'),
                      ),
                    );
                  }
                },
              ),

            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: RepaintBoundary(
          key: _globalKey,
          child: Column(
            children: _images
                .asMap()
                .map(
                  (index, image) =>
                  MapEntry(
                    index,
                    Dismissible(
                      key: Key(image.path),
                      onDismissed: (_) {
                        setState(() {
                          _images.removeAt(index);
                        });
                      },
                      child: FutureBuilder<ui.Image>(
                        future: _getImage(image),
                        builder: (BuildContext context, AsyncSnapshot<ui
                            .Image> snapshot) {
                          if (snapshot.connectionState == ConnectionState
                              .done && snapshot.data != null) {
                            ui.Image img = snapshot.data!;
                            return Column(
                              children: [
                                Container(
                                  width: MediaQuery
                                      .of(context)
                                      .size
                                      .width,
                                  height: MediaQuery
                                      .of(context)
                                      .size
                                      .width / img.width * img.height,
                                  child: Image.file(
                                    image,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                // 이미지 사이 간격 조정
                                SizedBox(
                                  height: 100,
                                ),
                              ],
                            );
                          }
                          return Container();
                        },
                      ),

                    ),
                  ),
                )
                .values
                .toList(),
          ),
        ),
      ),

      bottomSheet:
      Positioned(
        left: 0,
        right: 0,
        bottom: 0,
        child: Container(
          color: Colors.pinkAccent[100],
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
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => Home()),
                      );
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
                        MaterialPageRoute(builder: (context) => ConversionScreen()),
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
                        MaterialPageRoute(builder: (context) => DecoScreen()),
                      );
                    },
                    child: Text('만화데코'),
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