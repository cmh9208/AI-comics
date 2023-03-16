import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:uuid/uuid.dart';
import 'package:flutter/rendering.dart';
import 'dart:ui' as ui;
import 'package:flutter/services.dart';
import 'dart:typed_data';
import 'package:image_gallery_saver/image_gallery_saver.dart';


class MyScreen extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyScreen> {
  List<File> _images = [];

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView.builder(
        itemCount: _images.length,
        itemBuilder: (BuildContext context, int index) {
          return Dismissible(
            key: UniqueKey(),
            direction: DismissDirection.endToStart,
            background: Container(
              color: Colors.red,
              alignment: Alignment.centerRight,
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Icon(Icons.delete, color: Colors.white),
            ),
            onDismissed: (direction) {
              setState(() {
                _images.removeAt(index);
              });
            },
            child: Container(
              // 이미지 간격 조정
              margin: EdgeInsets.symmetric(horizontal: 10, vertical: 100),
              child: Image.file(_images[index]),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(

        onPressed: _pickImage,
        tooltip: 'Pick Image',
        child: Icon(Icons.add),
      ),
    );
  }
}





// component(emotion_sticker.dart)
class EmoticonSticker extends StatefulWidget {
  // ➊ 스티커를 그리는 위젯
  final VoidCallback onTransform; // ➏
  final String imgPath; // ➋ 이미지 경로
  final bool isSelected;

  const EmoticonSticker({
    required this.onTransform,
    required this.imgPath,
    required this.isSelected,
    Key? key,
  }) : super(key: key);

  @override
  State<EmoticonSticker> createState() => _EmoticonStickerState();
}

class _EmoticonStickerState extends State<EmoticonSticker> {
  // 확대/축소 배율
  double scale = 1;

  // 가로의 움직임
  double hTransform = 0;

  // 세로의 움직임
  double vTransform = 0;

  // 위젯의 초기 크기 기준 확대/축소 배율
  double actualScale = 1;

  @override
  Widget build(BuildContext context) {
    return Transform(
      // ➊ child 위젯을 변형할 수 있는 위젯
      transform: Matrix4.identity()
        ..translate(hTransform, vTransform) // ➋ 상/하 움직임 정의
        ..scale(scale, scale), // ➌ 확대/축소 정의

      // 기존 작성해둔 Container 위젯
      child: Container(
        decoration: widget.isSelected // ➊ 선택 상태일 때만 테두리 색상 구현
            ? BoxDecoration(
          borderRadius: BorderRadius.circular(4.0), // 모서리 둥글게
          border: Border.all(
            // 테두리 파란색
            color: Colors.blue,
            width: 1.0,
          ),
        )
            : BoxDecoration(
          // 테두리는 투명이나 너비는 1로 설정해서 스티커가 선택 취소될 때 깜빡이는 현상 제거
          border: Border.all(
            width: 1.0,
            color: Colors.transparent,
          ),
        ),

        // 기존에 작성해둔 GestureDetector
        child: GestureDetector(
          onTap: () {
            // ➌ 스티커를 눌렀을 때 실행할 함수
            widget.onTransform(); // ➏ 스티커의 상태가 변경될 때마다 실행
          },
          onScaleUpdate: (ScaleUpdateDetails details) {
            // ➍ 스티커의 확대 비율이 변경됐을 때 실행
            setState(() {
              scale =
                  details.scale * actualScale; // ➋ 최근 확대 비율 기반으로 실제 확대 비율 계산
              vTransform += details.focalPointDelta.dy; // ➌ 세로 이동 거리 계산
              hTransform += details.focalPointDelta.dx; // ➌ 가로 이동 거리 계산
            });
          },
          onScaleEnd: (ScaleEndDetails details) {
            actualScale = scale; // ➊ 확대 비율 저장
          }, // ➎ 스티커의 확대 비율 변경이 완료됐을 때 실행
          child: Image.asset(
            widget.imgPath, // ➋
          ),
        ),
      ),
    );
  }
}

// component(footer.dart)
// ➋ 스티커를 선택할 때마다 실행할 함수의 시그니처
typedef OnEmoticonTap = void Function(int id);
class Footer extends StatelessWidget {
  final OnEmoticonTap onEmoticonTap;

  const Footer({
    required this.onEmoticonTap,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white.withOpacity(0.9),
      height: 150,
      child: SingleChildScrollView(  // ➊ 가로로 스크롤 가능하게 스티커 구현
        scrollDirection: Axis.horizontal,
        child: Row(
          children: List.generate(
            7,
                (index) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: GestureDetector(
                onTap: () {
                  onEmoticonTap(index + 1);  // ➌ 스티커 선택할 때 실행할 함수
                },
                child: Image.asset(
                  'assets/images/con1/emoticon_${index + 1}.png',
                  height: 100,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}


// component(main_app_bar.dart)

class MainAppBar extends StatelessWidget {
  final VoidCallback onSaveImage;  // 이미지 저장 버튼 눌렀을 때 실행할 함수
  final VoidCallback onDeleteItem;  // 이미지 삭제 버튼 눌렀을 때 실행할 함수

  const MainAppBar({
    required this.onSaveImage,
    required this.onDeleteItem,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.9),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          IconButton(  // ➋ 스티커 삭제 버튼
            onPressed: onDeleteItem,
            icon: Icon(
              Icons.delete_forever_outlined,
              color: Colors.grey[700],
            ),
          ),
          IconButton(  // ➌ 이미지 저장 버튼
            onPressed: onSaveImage,
            icon: Icon(
              Icons.save,
              color: Colors.grey[700],
            ),
          ),
        ],
      ),
    );
  }
}


// model(sticker_model.dart)
class StickerModel {
  final String id;
  final String imgPath;

  StickerModel({
    required this.id,
    required this.imgPath,
  });

  @override
  bool operator ==(Object other) {  // ➊ ==로 같은지 비교할 때 사용되는 로직
    return (other as StickerModel).id == id; // ID값이 같은 인스턴스끼리는 같은 스티커로 인식
  }

  // ➋ Set에서 중복 여부를 결정하는 속성
  // ID값이 같으면 Set 안에서 같은 인스턴스로 인식
  @override
  int get hashCode => id.hashCode;
}


// screen(making_screen.dart)
class MakingScreen extends StatefulWidget {
  const MakingScreen({Key? key}) : super(key: key);

  @override
  State<MakingScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<MakingScreen> {
  XFile? image; // 선택한 이미지를 저장할 변수
  Set<StickerModel> stickers = {};  // 화면에 추가된 스티커를 저장할 변수
  String? selectedId;  // 현재 선택된 스티커의 ID
  GlobalKey imgKey = GlobalKey();



  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:
      Stack(
        children: [MyScreen(),

                  // 상단 메뉴 바(불러오기, 삭제, 저장)
                Positioned(
                top: 0,
                left: 0,
                right: 0,
                  child: MainAppBar(
                    onSaveImage: onSaveImage,
                    onDeleteItem: onDeleteItem,
                  ),
                ),

          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 20.0, horizontal: 20.0),
              // 스티커 리스트
              child: Footer(
                onEmoticonTap: onEmoticonTap,
              ),
            ),
          ),

        ],
      ),

    );
  }



  void onEmoticonTap(int index) async {
    setState(() {
      stickers = {
        ...stickers,
        StickerModel(
          id: Uuid().v4(), // ➊ 스티커의 고유 ID
          imgPath: 'assets/images/con1/emoticon_$index.png',
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
    if (image != null) {
      setState(() {
        image = null; // ➊ 이미지 변수 초기화
      });

      ScaffoldMessenger.of(context).showSnackBar( // ➌ Snackbar 표시
        SnackBar(
          content: Text('이미지가 삭제되었습니다!'),
        ),
      );
    }
  }

  void onTransform(String id){  // 스티커가 변형될 때마다 변형 중인 스티커를 현재 선택한 스티커로 지정
    setState(() {
      selectedId = id;
    });
  }
}
