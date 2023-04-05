import 'package:flutter/material.dart';
import 'package:ai_comics/comics_deco/component/main_app_bar.dart';
import 'package:ai_comics/comics_deco/model/sticker_model.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:ai_comics/comics_deco/component/footer.dart';
import 'package:ai_comics/comics_deco/model/sticker_model.dart';
import 'package:ai_comics/comics_deco/component/emoticon_sticker.dart';
import 'package:uuid/uuid.dart';
import 'package:flutter/rendering.dart';
import 'dart:ui' as ui;
import 'package:flutter/services.dart';
import 'dart:typed_data';
import 'package:image_gallery_saver/image_gallery_saver.dart';

import '../../comics_making/screen/making_screen.dart';
import '../../main_page/screen/home_screen.dart';
import '../../photo_conversion_page/screen/conversion_screen.dart';

class DecoScreen extends StatefulWidget {
  const DecoScreen({Key? key}) : super(key: key);

  @override
  State<DecoScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<DecoScreen> {
  XFile? image; // 선택한 이미지를 저장할 변수
  Set<StickerModel> stickers = {};  // 화면에 추가된 스티커를 저장할 변수
  String? selectedId;  // 현재 선택된 스티커의 ID
  GlobalKey imgKey = GlobalKey();

  // 미리 생성해둔 onPickImage() 함수 변경하기
  void onPickImage() async {
    final image = await ImagePicker()
        .pickImage(source: ImageSource.gallery); // ➊ 갤러리에서 이미지 선택하기

    setState(() {
      this.image = image; // 선택한 이미지 변수에 저장하기
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('만화데코'),
        backgroundColor: Colors.teal[200], // 연한 민트 색상 지정
        automaticallyImplyLeading: false, // 왼쪽의 뒤로가기 버튼 제거
        actions: [
          IconButton(
            icon: Icon(Icons.arrow_back),
            onPressed: () {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (context) => DecoScreen()),
                    (route) => false,
              );
            },
          ),

          IconButton(
            icon: Icon(Icons.add_photo_alternate),
            onPressed: onPickImage,
          ),
          IconButton(
            icon: Icon(Icons.save),
            onPressed: onSaveImage,
          ),
          IconButton(
            icon: Icon(Icons.delete),
            onPressed: onDeleteItem,
          ),
        ],
      ),

      body: renderBody(),

      bottomSheet:
      image != null ? Footer(
        onEmoticonTap: onEmoticonTap,
      ) : Positioned(
        left: 0,
        right: 0,
        bottom: 0,
        child: Container(
          color: Colors.teal[200],
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


  Widget renderBody() {
    if (image != null) {
      final imageFile = File(image!.path);

      return RepaintBoundary(
        key: imgKey,
        child: Positioned.fill(
          child: InteractiveViewer(
            child: SingleChildScrollView(
              child: FutureBuilder<ui.Image>(
                future: decodeImageFromList(imageFile.readAsBytesSync()),
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    final imageSize = snapshot.data!;
                    return Container(
                      width: imageSize.width.toDouble(),
                      height: imageSize.height.toDouble(),
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          Image.file(
                            imageFile,
                            fit: BoxFit.none,
                          ),
                          ...stickers.map(
                                (sticker) => Center(
                              child: EmoticonSticker(
                                key: ObjectKey(sticker.id),
                                onTransform: () {
                                  onTransform(sticker.id);
                                },
                                imgPath: sticker.imgPath,
                                isSelected: selectedId == sticker.id,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  } else if (snapshot.hasError) {
                    return Center(
                      child: Text('이미지 로딩 실패'),
                    );
                  } else {
                    return Center(
                      child: CircularProgressIndicator(),
                    );
                  }
                },
              ),
            ),
          ),
        ),
      );
    } else {
      return Center(
        child: TextButton(
          style: TextButton.styleFrom(
            primary: Colors.grey,
          ),
          onPressed: onPickImage,
          child: Text(
              style: TextStyle(fontSize: 24),
            '이미지 선택하기',
             // 글꼴 크기 24로 변경
          ),
        ),
      );
    }
  }


  void onEmoticonTap(int index) async {
    setState(() {
      stickers = {
        ...stickers,
        StickerModel(
          id: Uuid().v4(), // ➊ 스티커의 고유 ID
          imgPath: 'assets/images/sticker/emoticon_$index.png',
        ),
      };
    });
  }

  void onSaveImage() async {
    RenderRepaintBoundary boundary = imgKey.currentContext!
        .findRenderObject() as RenderRepaintBoundary;
    ui.Image image = await boundary.toImage(); // ➊ 바운더리를 이미지로 변경
    ByteData? byteData = await image.toByteData(format: ui.ImageByteFormat.png); // ➋ byte data 형태로 형태 변경
    Uint8List pngBytes = byteData!.buffer.asUint8List(); // ➌ Unit8List 형태로 형태 변경

    await ImageGallerySaver.saveImage(pngBytes, quality: 100);

    ScaffoldMessenger.of(context).showSnackBar(  // ➋ 저장 후 Snackbar 보여주기
      SnackBar(
        content: Text('저장되었습니다!'),
      ),
    );
  }

  void onDeleteItem() async {
    setState(() {
      stickers = stickers.where((sticker) => sticker.id != selectedId).toSet();  // ➊ 현재 선택돼 있는 스티커 삭제 후 Set로 변환
    });
  }

  void onTransform(String id){  // 스티커가 변형될 때마다 변형 중인 스티커를 현재 선택한 스티커로 지정
    setState(() {
      selectedId = id;
    });
  }
}
