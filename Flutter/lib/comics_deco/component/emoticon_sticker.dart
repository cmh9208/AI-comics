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
  String? text;

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
        child: Stack(
          children: [
            GestureDetector(
              onTap: () {
                widget.onTransform();
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
              child: Image.asset(
                widget.imgPath,
              ),
            ),
            if (widget.isSelected)
              Positioned.fill(
                child: Align(
                  alignment: Alignment.topCenter,
                  child: Container(
                    width: 70,
                    height: 10,
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Text',
                      ),
                      onChanged: (value) {
                        setState(() {
                          text = value;
                        });
                      },
                    ),
                  ),
                ),
              ),
            if (text != null)
              Positioned.fill(
                child: Align(
                  alignment: Alignment.bottomCenter,
                  child: Text(
                    text!,
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

