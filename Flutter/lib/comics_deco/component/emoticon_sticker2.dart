import 'package:flutter/material.dart';

class EmoticonSticker extends StatefulWidget {
  final VoidCallback onTransform;
  final String imgPath;
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
  double scale = 1;
  double hTransform = 0;
  double vTransform = 0;
  double actualScale = 1;
  bool isTextEditEnabled = true; // 1. 텍스트 입력 가능 여부 상태 추가
  TextEditingController textEditingController = TextEditingController(); // 2. TextEditingController 추가

  @override
  void initState() {
    super.initState();
    textEditingController.text = ''; // 3. 초기값 설정
  }

  @override
  void dispose() {
    textEditingController.dispose(); // 4. dispose 메소드 추가
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Transform(
      transform: Matrix4.identity()
        ..translate(hTransform, vTransform)
        ..scale(scale, scale),
      child: Container(
        decoration: widget.isSelected
            ? BoxDecoration(
          borderRadius: BorderRadius.circular(4.0),
          border: Border.all(
            color: Colors.blue,
            width: 1.0,
          ),
        )
            : BoxDecoration(
          border: Border.all(
            width: 1.0,
            color: Colors.transparent,
          ),
        ),
        child: GestureDetector(
          onTap: () {
            if (!isTextEditEnabled) return; // 5. 텍스트 입력이 불가능한 경우 클릭 이벤트 무시
            if (textEditingController.text.isNotEmpty) {
              isTextEditEnabled = false; // 6. 텍스트 입력 불가능 상태로 변경
            }
          },
          onScaleUpdate: (ScaleUpdateDetails details) {
            setState(() {
              scale = details.scale * actualScale;
              vTransform += details.focalPointDelta.dy;
              hTransform += details.focalPointDelta.dx;
            });
          },
          onScaleEnd: (ScaleEndDetails details) {
            actualScale = scale;
          },
          child: Stack( // 7. 스티커와 텍스트를 겹치기 위해 Stack 위젯 사용
            children: [
              Image.asset(
                widget.imgPath,
              ),
              Positioned.fill(
                child: Visibility(
                  visible: isTextEditEnabled,
                  child: Center( // 1. Center 위젯을 사용하여 텍스트 필드를 중앙에 위치시킴
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: TextField(
                        controller: textEditingController,
                        autofocus: true,
                        decoration: InputDecoration(
                          // hintText: 'TEXT',
                          border: InputBorder.none,
                        ),
                        style: TextStyle(
                          fontSize: 30,
                          color: Colors.black,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
