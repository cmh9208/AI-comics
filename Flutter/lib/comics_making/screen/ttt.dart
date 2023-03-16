import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
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
      appBar: AppBar(
        title: Text('Image Gallery'),
      ),
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
